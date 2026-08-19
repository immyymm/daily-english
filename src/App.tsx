import {
  ArchiveRestore,
  BookHeart,
  Brain,
  CalendarDays,
  Check,
  ChevronRight,
  CloudOff,
  Download,
  FileUp,
  Flame,
  Flower2,
  HeartHandshake,
  LibraryBig,
  LockKeyhole,
  RefreshCw,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Sprout,
  Trash2,
  Trophy,
  Wifi,
  X
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type ChangeEvent, type CSSProperties, type ReactNode } from 'react';
import { CardDetailModal } from './components/CardDetailModal';
import { EvaluationResultDetails } from './components/EvaluationResultDetails';
import { MasteryDetailModal } from './components/MasteryDetailModal';
import { ModalShell } from './components/ModalShell';
import { PrivacyConsentModal } from './components/PrivacyConsentModal';
import { ReviewSessionModal } from './components/ReviewSessionModal';
import { WeeklyTestModal } from './components/WeeklyTestModal';
import { quoteForStudyDay } from './data/dailyQuotes';
import { useAppData } from './hooks/useAppData';
import { notifyLocalDataChanged, useCloudSync } from './hooks/useCloudSync';
import { masteryDimensionLabels } from './learning/mastery';
import { studyDaySince, toLocalDateKey } from './learning/reviewEngine';
import { evaluateAnswer } from './services/ai';
import { clearLearningData, exportSnapshot, importSnapshot } from './storage/db';
import type { AIEvaluation, AppSnapshot, Attempt, CardProgress, DailyRecommendation, MasteryStatus, ReviewSessionProgress, TabId, WordCard } from './types';

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const statusOrder: MasteryStatus[] = ['未测试', '学习中', '识别词汇', '待巩固', '基本掌握', '主动掌握', '长期掌握', '薄弱词'];
const evaluationTimeFormatter = new Intl.DateTimeFormat('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

function App() {
  const data = useAppData();
  const sync = useCloudSync(data.refresh, data.aiEvaluations.some((item) => item.status === 'pending' || item.status === 'processing'));
  const [tab, setTab] = useState<TabId>('today');
  const [selectedCard, setSelectedCard] = useState<WordCard>();
  const [masteryCard, setMasteryCard] = useState<WordCard>();
  const [reviewQueue, setReviewQueue] = useState<WordCard[]>([]);
  const [reviewBatchTotal, setReviewBatchTotal] = useState(0);
  const [reviewSession, setReviewSession] = useState<ReviewSessionProgress>();
  const [showConsent, setShowConsent] = useState(false);
  const [showWeekly, setShowWeekly] = useState(false);
  const [showInstall, setShowInstall] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent>();
  const [online, setOnline] = useState(navigator.onLine);
  const [toast, setToast] = useState<string>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    const handleInstall = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('beforeinstallprompt', handleInstall);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleInstall);
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(undefined), 3200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const cardMap = useMemo(() => new Map(data.cards.map((card) => [card.id, card])), [data.cards]);
  const learnedCards = useMemo(
    () => data.progress.map((item) => cardMap.get(item.cardId)).filter(Boolean) as WordCard[],
    [cardMap, data.progress]
  );
  const dueCards = useMemo(
    () => data.dueProgress.map((item) => cardMap.get(item.cardId)).filter(Boolean) as WordCard[],
    [cardMap, data.dueProgress]
  );
  const reviewCard = reviewQueue[0];
  const aiToday = data.aiEvaluations.filter((item) => item.createdAt.startsWith(toLocalDateKey())).length;
  const aiLimitReached = aiToday >= (data.settings?.dailyAiLimit ?? 20);
  const aiAllowed = Boolean(data.settings?.aiConsent) && !aiLimitReached;

  const requestAI = () => {
    if (aiLimitReached) {
      setToast('今天的 AI 点评次数已用完，客观题和词卡仍可正常使用。');
    } else {
      setShowConsent(true);
    }
  };

  const acceptConsent = async () => {
    await data.updateSettings({ aiConsent: true });
    setShowConsent(false);
    setToast('AI 辅助点评已开启，请再次提交刚才的答案。');
  };

  const startReview = async () => {
    if (!dueCards.length) {
      setToast('现在没有到期复习，先去学习今日新词吧。');
      return;
    }
    try {
      const result = await data.beginReviewSession(dueCards.map((card) => card.id));
      const queue = result.session.queueCardIds.map((cardId) => cardMap.get(cardId)).filter(Boolean) as WordCard[];
      if (!queue.length) {
        setToast('今天的复习已完成。');
        return;
      }
      setReviewSession(result.session);
      setReviewBatchTotal(result.session.batchTotal);
      setReviewQueue(queue);
      if (result.resumed) setToast(`已恢复上次进度，从 ${queue[0].word} 继续。`);
    } catch (error) {
      setToast(error instanceof Error ? error.message : '复习进度读取失败，请稍后重试。');
    }
  };

  const completeReviewWord = async (cardId: string, attempts: Attempt[], evaluations: AIEvaluation[]) => {
    await data.recordReviewSession(cardId, attempts, evaluations);
    const remaining = reviewQueue[0]?.id === cardId
      ? reviewQueue.slice(1)
      : reviewQueue.filter((card) => card.id !== cardId);
    if (reviewSession) {
      const nextSession = await data.advanceReviewSession(reviewSession.id, cardId, remaining.map((card) => card.id));
      setReviewSession(nextSession?.status === 'active' ? nextSession : undefined);
    }
    setReviewQueue(remaining);
    if (remaining.length) {
      setToast(`已完成 ${cardMap.get(cardId)?.word ?? cardId}，继续复习剩余 ${remaining.length} 个词。`);
    } else {
      setReviewBatchTotal(0);
      setToast('本次全部到期词已复习完成。');
    }
  };

  const openNextWord = () => {
    const completed = new Set(data.todayPlan?.completedCardIds ?? []);
    setSelectedCard(data.todayCards.find((card) => !completed.has(card.id)) ?? data.todayCards[0]);
  };

  const downloadBackup = async () => {
    const snapshot = await exportSnapshot();
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '每日英语-学习备份-' + toLocalDateKey() + '.json';
    link.click();
    URL.revokeObjectURL(url);
    setToast('学习数据已导出。');
  };

  const restoreBackup = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const snapshot = JSON.parse(await file.text()) as AppSnapshot;
      await importSnapshot(snapshot);
      await data.refresh();
      notifyLocalDataChanged();
      setToast('学习数据恢复成功。');
    } catch (error) {
      setToast(error instanceof Error ? error.message : '备份恢复失败。');
    } finally {
      event.target.value = '';
    }
  };

  const resetData = async () => {
    if (!window.confirm('确定清除本机全部学习记录吗？此操作无法撤销，建议先导出备份。')) return;
    await clearLearningData();
    await data.refresh();
    notifyLocalDataChanged();
    setToast('本机学习记录已清除。');
  };

  const installApp = async () => {
    if (installPrompt) {
      await installPrompt.prompt();
      await installPrompt.userChoice;
      setInstallPrompt(undefined);
      setShowInstall(false);
      return;
    }
    setShowInstall(true);
  };

  const retryPending = async (evaluation: AIEvaluation) => {
    if (!online) {
      setToast('当前仍处于离线状态。');
      return;
    }
    if (!data.settings?.aiConsent) {
      setShowConsent(true);
      return;
    }
    const fallback = learnedCards[0] ?? data.cards[0];
    const card = cardMap.get(evaluation.cardId) ?? fallback;
    if (!card) return;
    const question = card.questions.find((item) => item.type === evaluation.questionType) ?? card.questions[0];
    try {
      setToast('正在重新提交待评分答案…');
      const response = await evaluateAnswer({
        requestId: evaluation.requestId,
        card,
        questionId: evaluation.questionId ?? question?.id ?? evaluation.requestId,
        questionType: evaluation.questionType,
        stage: evaluation.stage,
        prompt: evaluation.prompt ?? question?.prompt ?? '请综合评价这段英文表达。',
        answer: evaluation.answer,
        correctAnswer: evaluation.correctAnswer ?? question?.answer ?? '',
        responseMs: evaluation.responseMs ?? 0,
        rubricVersion: evaluation.rubricVersion,
        weeklyWords: evaluation.cardId.startsWith('weekly-') ? learnedCards.slice(0, 10).map((item) => item.word) : undefined
      });
      if (response.status !== 'complete') {
        await data.saveAIEvaluation({ ...evaluation, status: response.status, updatedAt: new Date().toISOString(), errorMessage: undefined });
        setToast('答案已重新进入后台点评，完成后会自动更新。');
        return;
      }
      const createdAt = new Date().toISOString();
      const attempt: Attempt = {
        id: evaluation.requestId,
        cardId: evaluation.cardId,
        questionId: evaluation.questionId ?? evaluation.requestId,
        questionType: evaluation.questionType,
        stage: evaluation.stage,
        prompt: evaluation.prompt ?? question?.prompt ?? '周测综合表达',
        answer: evaluation.answer,
        correctAnswer: response.result.correctedAnswer,
        score: response.result.overallScore,
        correct: response.result.overallScore >= 75 && !response.result.needsRetry,
        responseMs: evaluation.responseMs ?? 0,
        errorTypes: response.result.errorTypes,
        createdAt,
        ai: true,
        scheduleImpact: false
      };
      if (evaluation.cardId.startsWith('weekly-')) {
        await data.recordWeeklyResult(attempt, { ...evaluation, status: 'complete', model: response.model, result: response.result, errorMessage: undefined });
      } else {
        await data.completeAIAttempt(evaluation, response.result, response.model, attempt);
      }
      setToast('待评分答案已经完成点评。');
    } catch (error) {
      setToast(error instanceof Error ? error.message : '重试失败。');
    }
  };

  if (data.loading) return <LoadingScreen />;
  if (data.error || !data.settings || !data.todayPlan) return <ErrorScreen message={data.error ?? '初始化失败'} onRetry={() => void data.refresh()} />;

  return (
    <main className={data.settings.reduceMotion ? 'app-shell reduce-motion' : 'app-shell'}>
      <header className="topbar">
        <div className="brand-mark" aria-hidden="true"><Flower2 size={20} /></div>
        <div>
          <p className="eyebrow">{new Intl.DateTimeFormat('zh-CN', { month: 'long', day: 'numeric', weekday: 'short' }).format(new Date())}</p>
          <h1>每日英语</h1>
        </div>
        <div className="header-actions">
          <span className={online ? 'network-dot online' : 'network-dot'} title={online ? '在线' : '离线'}>{online ? <Wifi size={14} /> : <CloudOff size={14} />}</span>
          <button className="streak" aria-label={'连续学习 ' + data.settings.streak + ' 天'}><Flame size={17} />{data.settings.streak}</button>
        </div>
      </header>

      {tab === 'today' && (
        <TodayPage
          todayCards={data.todayCards}
          todayPlan={data.todayPlan}
          progressMap={data.progressMap}
          dueCount={data.dueProgress.length}
          totalCards={data.cards.length}
          onOpenCard={setSelectedCard}
          onStart={openNextWord}
          onReview={() => { setTab('review'); window.scrollTo(0, 0); }}
        />
      )}
      {tab === 'review' && (
        <ReviewPage
          cards={data.cards}
          progress={data.progress}
          attempts={data.attempts}
          settings={data.settings}
          dueProgress={data.dueProgress}
          dueCards={dueCards}
          onStart={startReview}
          onOpenCard={setSelectedCard}
          onWeekly={() => setShowWeekly(true)}
          recommendation={data.todayRecommendation}
          onOpenMastery={setMasteryCard}
        />
      )}
      {tab === 'library' && <LibraryPage cards={data.cards} progressMap={data.progressMap} onOpenCard={setSelectedCard} onOpenMastery={setMasteryCard} />}
      {tab === 'profile' && (
        <ProfilePage
          cards={data.cards}
          progress={data.progress}
          attempts={data.attempts}
          settings={data.settings}
          aiEvaluations={data.aiEvaluations}
          aiToday={aiToday}
          onToggleAI={(value) => void data.updateSettings({ aiConsent: value })}
          onToggleMotion={(value) => void data.updateSettings({ reduceMotion: value })}
          onExport={() => void downloadBackup()}
          onImport={() => fileInputRef.current?.click()}
          onReset={() => void resetData()}
          onInstall={() => void installApp()}
          onRetryPending={(evaluation) => void retryPending(evaluation)}
          sync={sync}
        />
      )}

      <nav className="bottom-nav" aria-label="主导航">
        <NavButton active={tab === 'today'} icon={<Flower2 size={21} />} label="今日" onClick={() => setTab('today')} />
        <NavButton active={tab === 'review'} icon={<BookHeart size={21} />} label="复习" badge={data.dueProgress.length} onClick={() => setTab('review')} />
        <NavButton active={tab === 'library'} icon={<LibraryBig size={21} />} label="词卡" onClick={() => setTab('library')} />
        <NavButton active={tab === 'profile'} icon={<Sparkles size={21} />} label="我的" onClick={() => setTab('profile')} />
      </nav>

      <CardDetailModal
        card={selectedCard}
        progress={selectedCard ? data.progressMap.get(selectedCard.id) : undefined}
        open={Boolean(selectedCard)}
        onClose={() => setSelectedCard(undefined)}
        onLearn={async (card) => {
          await data.learnCard(card);
          setToast('已安排 T0 即时复测。');
        }}
      />
      <ReviewSessionModal
        card={reviewCard}
        progress={reviewCard ? data.progressMap.get(reviewCard.id) : undefined}
        open={Boolean(reviewCard)}
        batchPosition={reviewBatchTotal ? reviewBatchTotal - reviewQueue.length + 1 : 1}
        batchTotal={reviewBatchTotal || 1}
        savedSession={reviewSession}
        aiConsent={aiAllowed}
        onNeedConsent={requestAI}
        onClose={() => {
          setReviewQueue([]);
          setReviewBatchTotal(0);
          setReviewSession(undefined);
          setToast('复习进度已保存，下次会从这里继续。');
        }}
        onComplete={completeReviewWord}
        onSaveProgress={data.saveReviewSessionProgress}
        onRecordAttempt={data.saveSessionAttempt}
        onQueueEvaluation={data.saveAIEvaluation}
        onCompleteEvaluation={data.completeAIAttempt}
      />
      <PrivacyConsentModal open={showConsent} onClose={() => setShowConsent(false)} onAccept={acceptConsent} />
      <WeeklyTestModal
        open={showWeekly}
        cards={learnedCards.slice(-35).reverse()}
        aiConsent={aiAllowed}
        onNeedConsent={requestAI}
        onClose={() => setShowWeekly(false)}
        onSave={data.recordWeeklyResult}
        onQueueEvaluation={data.saveAIEvaluation}
      />
      <MasteryDetailModal
        open={Boolean(masteryCard)}
        card={masteryCard}
        progress={masteryCard ? data.progressMap.get(masteryCard.id) : undefined}
        prescription={masteryCard ? data.todayRecommendation?.cardPrescriptions?.[masteryCard.id] : undefined}
        attempts={data.attempts}
        evaluations={data.aiEvaluations}
        onClose={() => setMasteryCard(undefined)}
        onRetry={(evaluation) => void retryPending(evaluation)}
      />
      <InstallModal open={showInstall} onClose={() => setShowInstall(false)} />
      <input ref={fileInputRef} type="file" accept="application/json" hidden onChange={(event) => void restoreBackup(event)} />
      {toast && <div className="toast" role="status"><Sparkles size={16} />{toast}<button onClick={() => setToast(undefined)} aria-label="关闭提示"><X size={15} /></button></div>}
    </main>
  );
}

function TodayPage({
  todayCards,
  todayPlan,
  progressMap,
  dueCount,
  totalCards,
  onOpenCard,
  onStart,
  onReview
}: {
  todayCards: WordCard[];
  todayPlan: { studyDay: number; cycle: number; completedCardIds: string[] };
  progressMap: Map<string, CardProgress>;
  dueCount: number;
  totalCards: number;
  onOpenCard: (card: WordCard) => void;
  onStart: () => void;
  onReview: () => void;
}) {
  const completed = new Set(todayPlan.completedCardIds);
  const completedCount = completed.size;
  const progress = completedCount / 5 * 100;
  const quote = quoteForStudyDay(todayPlan.studyDay);
  return (
    <>
      <section className="hero-card">
        <div className="hero-copy">
          <span className="soft-label"><Sparkles size={15} />第 {todayPlan.studyDay} 个学习日</span>
          <h2>{completedCount === 5 ? '今天的认真，已经开花。' : quote.title}</h2>
          <p className="hero-message">{completedCount === 5 ? '五个词已经收入今天的记忆花园，记得按时回来复习。' : quote.body}</p>
          <p className="hero-note">{todayPlan.cycle > 1 ? '第 ' + todayPlan.cycle + ' 轮巩固' : '今日约 8 分钟'} · 学完自动安排间隔复习</p>
        </div>
        <div className="progress-flower" aria-label={'今日进度 ' + completedCount + '/5'} style={{ '--progress': progress + '%' } as CSSProperties}>
          <span>{completedCount}<small>/5</small></span>
        </div>
      </section>

      {dueCount > 0 && (
        <button className="review-reminder" onClick={onReview}>
          <span className="quick-icon coral"><Brain size={20} /></span>
          <span><strong>{dueCount} 个单词等待复习</strong><small>逾期和薄弱词会优先出现</small></span>
          <ChevronRight size={19} />
        </button>
      )}

      <section className="section-block">
        <div className="section-heading">
          <div><p className="eyebrow">TODAY'S WORDS</p><h3>今日 5 词</h3></div>
          <span className="pill">{completedCount}/5 已学习</span>
        </div>
        <div className="word-stack expanded">
          {todayCards.map((card, index) => {
            const learned = completed.has(card.id);
            const progressItem = progressMap.get(card.id);
            return (
              <button className="word-preview" key={card.id} onClick={() => onOpenCard(card)}>
                <div className={learned ? 'word-index learned' : 'word-index'}>{learned ? <Check size={16} /> : String(index + 1).padStart(2, '0')}</div>
                <div className="word-copy">
                  <div className="word-title"><strong>{card.word}</strong><span>{card.partOfSpeech}</span></div>
                  <p>{card.phonetic}</p>
                  <span className="meaning">{card.coreMemory.chinese}</span>
                </div>
                <div className="word-status"><span>{progressItem?.status ?? '新词'}</span><ChevronRight size={18} /></div>
              </button>
            );
          })}
        </div>
        <button className="primary-button" onClick={onStart}>
          <BookHeart size={19} />{completedCount === 5 ? '再看一遍今日词卡' : completedCount ? '继续今天的学习' : '开始今天的学习'}
        </button>
      </section>

      <section className="quick-grid" aria-label="学习概览">
        <article><span className="quick-icon coral"><CalendarDays size={20} /></span><div><strong>{dueCount}</strong><p>待复习</p></div></article>
        <article><span className="quick-icon pink"><LibraryBig size={20} /></span><div><strong>{totalCards}</strong><p>全部词卡</p></div></article>
      </section>
    </>
  );
}

function ReviewPage({
  cards,
  progress,
  attempts,
  settings,
  dueProgress,
  dueCards,
  onStart,
  onOpenCard,
  onOpenMastery,
  onWeekly,
  recommendation
}: {
  cards: WordCard[];
  progress: CardProgress[];
  attempts: Attempt[];
  settings: { firstUseDate: string };
  dueProgress: CardProgress[];
  dueCards: WordCard[];
  onStart: () => void;
  onOpenCard: (card: WordCard) => void;
  onOpenMastery: (card: WordCard) => void;
  onWeekly: () => void;
  recommendation?: DailyRecommendation;
}) {
  const studyDay = studyDaySince(settings.firstUseDate);
  const overdue = dueProgress.filter((item) => new Date(item.nextReviewAt).getTime() < new Date(toLocalDateKey() + 'T00:00:00').getTime()).length;
  const weak = dueProgress.filter((item) => item.weak).length;
  const accuracy = attempts.length ? Math.round(attempts.filter((item) => item.correct).length / attempts.length * 100) : 0;

  return (
    <div className="page-stack">
      <section className="page-intro">
        <span className="soft-label"><Brain size={15} />MEMORY GARDEN</span>
        <h2>把见过的词，<br />变成随时能说的话。</h2>
        <p>复习顺序会根据到期时间、错词和掌握状态自动调整。</p>
      </section>
      <section className="metric-row">
        <article><strong>{dueProgress.length}</strong><span>今日到期</span></article>
        <article><strong>{overdue}</strong><span>逾期复习</span></article>
        <article><strong>{weak}</strong><span>薄弱词</span></article>
        <article><strong>{accuracy}%</strong><span>总正确率</span></article>
      </section>
      <button className="primary-button prominent" onClick={onStart} disabled={!dueProgress.length}>
        <Brain size={20} />{dueProgress.length ? '开始优先复习' : '今天的复习已完成'}
      </button>

      {recommendation && (
        <section className="adaptive-plan-card">
          <div className="adaptive-plan-head"><Sparkles size={20} /><div><span>04:30 Codex 分析 · 05:00 生成计划</span><h3>今日针对性复习方案</h3></div></div>
          <div className={'codex-plan-status ' + recommendation.codexStatus}>
            {recommendation.codexStatus === 'complete' ? <Check size={15} /> : <RefreshCw size={15} />}
            <span>
              {recommendation.codexStatus === 'complete'
                ? `Codex 深度分析已完成${recommendation.codexGeneratedAt ? ` · ${new Date(recommendation.codexGeneratedAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}` : ''}`
                : recommendation.codexStatus === 'failed'
                  ? 'Codex 深度分析失败，当前使用数据库基础方案'
                  : '数据库基础方案已就绪，等待 Codex 深度分析'}
            </span>
          </div>
          <p>{recommendation.summary}</p>
          <div className="adaptive-plan-meta">
            <span>新词 {recommendation.newCardIds?.length ?? 5} 个</span>
            <span>当前待复习 {dueProgress.length} 个</span>
            <span>建议 {recommendation.targetQuestionCount} 题/词</span>
            {recommendation.focusDimensions.map((dimension) => <span key={dimension}>加强{masteryDimensionLabels[dimension]}</span>)}
          </div>
          {recommendation.codexAnalysis && (
            <div className="codex-plan-details">
              {recommendation.codexAnalysis.weaknesses.length > 0 && (
                <div>
                  <strong>薄弱点与调整</strong>
                  {recommendation.codexAnalysis.weaknesses.map((item, index) => (
                    <article key={`${item.dimension}-${index}`}>
                      <span>{masteryDimensionLabels[item.dimension]}</span>
                      <p>{item.evidence}</p>
                      <small>{item.action}</small>
                    </article>
                  ))}
                </div>
              )}
              {recommendation.codexAnalysis.strategy.length > 0 && (
                <div className="codex-strategy-list">
                  <strong>今日执行策略</strong>
                  {recommendation.codexAnalysis.strategy.map((item, index) => <p key={`${item}-${index}`}><i>{index + 1}</i>{item}</p>)}
                </div>
              )}
            </div>
          )}
        </section>
      )}

      <section className="section-block">
        <div className="section-heading"><div><p className="eyebrow">REVIEW QUEUE</p><h3>复习队列</h3></div><span className="pill">{dueProgress.length} 个</span></div>
        {dueCards.length ? (
          <div className="queue-list">
            {dueCards.slice(0, 8).map((card) => {
              const item = dueProgress.find((progressItem) => progressItem.cardId === card.id)!;
              const prescription = recommendation?.cardPrescriptions?.[card.id];
              return (
                <article className="queue-item" key={card.id}>
                  <span className={item.weak ? 'queue-dot weak' : 'queue-dot'} />
                  <button className="queue-word-button" onClick={() => onOpenCard(card)}><strong>{card.word}</strong><p>{item.stage} · {item.status}{prescription ? ` · 遗忘风险 ${prescription.riskScore}` : ''}</p></button>
                  <button className="queue-score" onClick={() => onOpenMastery(card)}>{item.masteryScore === undefined ? item.lastScore === undefined ? '未测试' : item.lastScore + ' 分' : Math.round(item.masteryScore) + ' 分'}<small>查看分析</small></button>
                  <ChevronRight size={17} />
                </article>
              );
            })}
          </div>
        ) : (
          <div className="empty-card"><Sprout size={30} /><strong>暂时没有到期任务</strong><p>完成今日词卡后，T0 即时测试会出现在这里。</p></div>
        )}
      </section>

      <section className={studyDay >= 7 ? 'weekly-card' : 'weekly-card locked'}>
        <div className="weekly-icon"><Trophy size={26} /></div>
        <div><span>每 7 个学习日</span><h3>本周综合测试</h3><p>短文、真实表达和口语文字稿由 AI 综合点评。</p></div>
        <button onClick={onWeekly} disabled={studyDay < 7}>{studyDay < 7 ? '第 7 天解锁' : '开始周测'}</button>
      </section>

      {progress.length > 0 && (
        <section className="mastery-summary">
          <div className="section-heading"><div><p className="eyebrow">MASTERY</p><h3>掌握状态</h3></div></div>
          {statusOrder.filter((status) => status !== '未测试').map((status) => {
            const count = progress.filter((item) => item.status === status).length;
            if (!count) return null;
            return <div className="mastery-line" key={status}><span>{status}</span><div><i style={{ width: Math.max(6, count / progress.length * 100) + '%' }} /></div><b>{count}</b></div>;
          })}
        </section>
      )}
      {cards.length === 0 && null}
    </div>
  );
}

function LibraryPage({ cards, progressMap, onOpenCard, onOpenMastery }: { cards: WordCard[]; progressMap: Map<string, CardProgress>; onOpenCard: (card: WordCard) => void; onOpenMastery: (card: WordCard) => void }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'全部' | MasteryStatus>('全部');
  const filtered = cards.filter((card) => {
    const matchesText = !query || card.word.toLowerCase().includes(query.toLowerCase()) || card.coreMemory.chinese.includes(query);
    const status = progressMap.get(card.id)?.status ?? '未测试';
    return matchesText && (filter === '全部' || status === filter);
  });
  return (
    <div className="page-stack">
      <section className="page-intro compact">
        <span className="soft-label"><LibraryBig size={15} />ALL CARDS</span>
        <h2>我的单词花圃</h2>
        <p>共 {cards.length} 张完整词卡，可按单词、中文或掌握状态查找。</p>
      </section>
      <label className="search-box"><Search size={19} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索单词或中文…" />{query && <button onClick={() => setQuery('')} aria-label="清空搜索"><X size={16} /></button>}</label>
      <div className="filter-scroll">
        {(['全部', ...statusOrder] as const).map((status) => <button className={filter === status ? 'active' : ''} key={status} onClick={() => setFilter(status)}>{status}</button>)}
      </div>
      <div className="library-count">找到 {filtered.length} 张词卡</div>
      <section className="library-list">
        {filtered.map((card) => {
          const item = progressMap.get(card.id);
          return (
            <article key={card.id}>
              <button className="library-card-button" onClick={() => onOpenCard(card)}>
                <div className="library-letter">{card.word.slice(0, 1).toUpperCase()}</div>
                <div><div className="word-title"><strong>{card.word}</strong><span>{card.partOfSpeech}</span></div><p>{card.phonetic}</p><small>{card.coreMemory.chinese}</small></div>
              </button>
              <button className={'status-tag mastery-link ' + (item?.weak ? 'weak' : '')} onClick={() => onOpenMastery(card)}>
                <span>{item?.status ?? '未测试'}</span><small>{item ? '查看分析' : '尚未学习'}</small>
              </button>
              <ChevronRight size={17} />
            </article>
          );
        })}
      </section>
    </div>
  );
}

function ProfilePage({
  cards,
  progress,
  attempts,
  settings,
  aiEvaluations,
  aiToday,
  onToggleAI,
  onToggleMotion,
  onExport,
  onImport,
  onReset,
  onInstall,
  onRetryPending,
  sync
}: {
  cards: WordCard[];
  progress: CardProgress[];
  attempts: Attempt[];
  settings: { streak: number; aiConsent: boolean; reduceMotion: boolean; dailyAiLimit: number };
  aiEvaluations: AIEvaluation[];
  aiToday: number;
  onToggleAI: (value: boolean) => void;
  onToggleMotion: (value: boolean) => void;
  onExport: () => void;
  onImport: () => void;
  onReset: () => void;
  onInstall: () => void;
  onRetryPending: (evaluation: AIEvaluation) => void;
  sync: ReturnType<typeof useCloudSync>;
}) {
  const [syncEmail, setSyncEmail] = useState('');
  const [syncPassword, setSyncPassword] = useState('');
  const [sendingLink, setSendingLink] = useState(false);
  const [evaluationQuery, setEvaluationQuery] = useState('');
  const [evaluationStatus, setEvaluationStatus] = useState<'all' | AIEvaluation['status']>('all');
  const [visibleEvaluationCount, setVisibleEvaluationCount] = useState(10);
  const mastered = progress.filter((item) => item.status === '主动掌握' || item.status === '长期掌握').length;
  const weak = progress.filter((item) => item.weak).length;
  const accuracy = attempts.length ? Math.round(attempts.filter((item) => item.correct).length / attempts.length * 100) : 0;
  const pending = aiEvaluations.filter((item) => item.status !== 'complete');
  const wordNames = useMemo(() => new Map(cards.map((card) => [card.id, card.word])), [cards]);
  const filteredEvaluations = useMemo(() => {
    const query = evaluationQuery.trim().toLocaleLowerCase();
    return [...aiEvaluations]
      .filter((evaluation) => evaluationStatus === 'all' || evaluation.status === evaluationStatus)
      .filter((evaluation) => {
        if (!query) return true;
        const word = evaluation.cardId.startsWith('weekly-') ? '周测综合表达' : wordNames.get(evaluation.cardId) ?? evaluation.cardId;
        return [word, evaluation.prompt, evaluation.answer, evaluation.result?.reasonZh]
          .filter(Boolean)
          .some((value) => String(value).toLocaleLowerCase().includes(query));
      })
      .sort((a, b) => new Date(b.updatedAt ?? b.createdAt).getTime() - new Date(a.updatedAt ?? a.createdAt).getTime());
  }, [aiEvaluations, evaluationQuery, evaluationStatus, wordNames]);
  const visibleEvaluations = filteredEvaluations.slice(0, visibleEvaluationCount);

  return (
    <div className="page-stack">
      <section className="profile-hero">
        <div className="profile-flower"><Flower2 size={31} /></div>
        <p className="eyebrow">MY LITTLE GARDEN</p>
        <h2>今天也在认真生长</h2>
        <p>连续学习 <b>{settings.streak}</b> 天</p>
      </section>
      <section className="metric-row profile">
        <article><strong>{progress.length}</strong><span>已学单词</span></article>
        <article><strong>{mastered}</strong><span>主动掌握</span></article>
        <article><strong>{accuracy}%</strong><span>答题正确率</span></article>
        <article><strong>{weak}</strong><span>薄弱词</span></article>
      </section>

      <section className="settings-card">
        <div className="settings-title"><Settings2 size={19} /><h3>学习设置</h3></div>
        <SettingToggle icon={<Sparkles size={18} />} title="AI 辅助点评" description={'今天已用 ' + aiToday + ' / ' + settings.dailyAiLimit + ' 次'} checked={settings.aiConsent} onChange={onToggleAI} />
        <SettingToggle icon={<Flower2 size={18} />} title="减少动态效果" description="关闭翻卡和庆祝动效" checked={settings.reduceMotion} onChange={onToggleMotion} />
      </section>

      {pending.length > 0 && (
        <section className="pending-card">
          <div><CloudOff size={20} /><div><strong>{pending.length} 条答案正在处理或等待重试</strong><p>已登录时答案和结果都会保存在云端，不会因关闭页面而丢失。</p></div></div>
          <button onClick={() => onRetryPending(pending[0])}><RefreshCw size={16} />重试一条</button>
        </section>
      )}

      {aiEvaluations.length > 0 && (
        <section className="settings-card ai-history-card">
          <div className="settings-title"><Sparkles size={19} /><h3>AI 点评记录</h3><span className="settings-count">{filteredEvaluations.length}/{aiEvaluations.length}</span></div>
          <div className="evaluation-history-tools">
            <label><Search size={16} /><input value={evaluationQuery} onChange={(event) => { setEvaluationQuery(event.target.value); setVisibleEvaluationCount(10); }} placeholder="搜索单词、题目或回答" /></label>
            <div role="group" aria-label="筛选点评状态">
              {([
                ['all', '全部'],
                ['complete', '已完成'],
                ['pending', '等待中'],
                ['processing', '点评中'],
                ['failed', '待重试']
              ] as const).map(([value, label]) => (
                <button className={evaluationStatus === value ? 'active' : ''} key={value} onClick={() => { setEvaluationStatus(value); setVisibleEvaluationCount(10); }}>{label}</button>
              ))}
            </div>
          </div>
          <div className="profile-evaluation-list">
            {visibleEvaluations.map((evaluation) => (
              <details key={evaluation.requestId}>
                <summary>
                  <span><b>{evaluation.cardId.startsWith('weekly-') ? '周测综合表达' : wordNames.get(evaluation.cardId) ?? evaluation.cardId}</b><small>{evaluationTimeFormatter.format(new Date(evaluation.updatedAt ?? evaluation.createdAt))}</small></span>
                  <strong className={'evaluation-score ' + evaluation.status}>{evaluation.result ? evaluation.result.overallScore + ' 分' : evaluation.status === 'failed' ? '待重试' : evaluation.status === 'processing' ? '点评中' : '等待中'}</strong>
                </summary>
                <div className="profile-evaluation-body">
                  {evaluation.prompt && <p className="evaluation-record-copy"><strong>题目</strong>{evaluation.prompt}</p>}
                  <p className="evaluation-record-copy"><strong>你的回答</strong><span lang="en">{evaluation.answer}</span></p>
                  {evaluation.result ? <EvaluationResultDetails result={evaluation.result} /> : <p className="evaluation-record-message">{evaluation.errorMessage ?? '后台点评完成后会自动更新到这里；切换设备或重新打开页面也会主动补拉。'}</p>}
                  {evaluation.status === 'failed' && <button className="secondary-button" onClick={() => onRetryPending(evaluation)}><RefreshCw size={16} />重新提交</button>}
                </div>
              </details>
            ))}
            {filteredEvaluations.length === 0 && <p className="evaluation-history-empty">没有符合筛选条件的点评。</p>}
          </div>
          {visibleEvaluationCount < filteredEvaluations.length && <button className="evaluation-load-more" onClick={() => setVisibleEvaluationCount((count) => count + 10)}>再显示 10 条</button>}
        </section>
      )}

      <section className="settings-card sync-card">
        <div className="settings-title"><Wifi size={19} /><h3>多设备实时同步</h3></div>
        {sync.session ? (
          <div className="sync-panel">
            <div className="sync-status-row">
              <span className={'sync-dot ' + sync.state} />
              <div><strong>{sync.session.user.email}</strong><p>{sync.message}</p></div>
            </div>
            {sync.lastSyncedAt && <small>最近同步：{new Intl.DateTimeFormat('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(sync.lastSyncedAt))}</small>}
            <div className="cloud-record-counts" aria-label="云端学习记录数量">
              <article><span>词汇掌握</span><b>{sync.cloudCounts?.mastery ?? '—'}</b><small>本机 {progress.length}</small></article>
              <article><span>答题记录</span><b>{sync.cloudCounts?.attempts ?? '—'}</b><small>本机 {attempts.length}</small></article>
              <article><span>AI 点评</span><b>{sync.cloudCounts?.evaluations ?? '—'}</b><small>本机 {aiEvaluations.length}</small></article>
            </div>
            <div className="sync-actions">
              <button onClick={() => void sync.syncNow()} disabled={sync.state === 'connecting'}><RefreshCw size={15} />立即同步</button>
              <button className="quiet" onClick={() => void sync.signOut()}>退出同步</button>
            </div>
          </div>
        ) : (
          <form className="sync-panel" onSubmit={async (event) => {
            event.preventDefault();
            if (!syncEmail.trim() || syncPassword.length < 8) return;
            setSendingLink(true);
            try {
              await sync.signIn(syncEmail, syncPassword);
            } finally {
              setSendingLink(false);
            }
          }}>
            <p>不登录也能继续使用。同一“每日英语”邮箱账户登录的 iPhone、iPad 和电脑会自动合并学习记录；它与 ChatGPT 账号无关。</p>
            <label className="sync-email"><span>邮箱</span><input type="email" value={syncEmail} onChange={(event) => setSyncEmail(event.target.value)} placeholder="name@example.com" autoComplete="email" required /></label>
            <label className="sync-email"><span>密码（至少 8 位）</span><input type="password" minLength={8} value={syncPassword} onChange={(event) => setSyncPassword(event.target.value)} placeholder="仅用于每日英语同步" autoComplete="current-password" required /></label>
            <div className="sync-actions auth">
              <button type="submit" disabled={!sync.configured || sendingLink || sync.state === 'connecting'}>{sendingLink ? <RefreshCw size={16} /> : <Wifi size={16} />}{sendingLink ? '登录中…' : '登录并同步'}</button>
              <button className="quiet" type="button" disabled={!sync.configured || sendingLink || syncPassword.length < 8} onClick={async () => {
                setSendingLink(true);
                try {
                  await sync.signUp(syncEmail, syncPassword);
                } finally {
                  setSendingLink(false);
                }
              }}>第一次使用，注册</button>
            </div>
            <small>{sync.message}</small>
          </form>
        )}
      </section>

      <section className="settings-card">
        <div className="settings-title"><ShieldCheck size={19} /><h3>数据与隐私</h3></div>
        <button className="setting-row action" onClick={onExport}><span className="setting-icon"><Download size={18} /></span><div><strong>导出学习数据</strong><p>下载 JSON 备份文件</p></div><ChevronRight size={17} /></button>
        <button className="setting-row action" onClick={onImport}><span className="setting-icon"><FileUp size={18} /></span><div><strong>从备份恢复</strong><p>恢复词卡进度、答题和 AI 点评</p></div><ChevronRight size={17} /></button>
        <button className="setting-row action" onClick={onInstall}><span className="setting-icon"><ArchiveRestore size={18} /></span><div><strong>安装到 iPhone 主屏幕</strong><p>像普通 APP 一样打开</p></div><ChevronRight size={17} /></button>
        <button className="setting-row action danger" onClick={onReset}><span className="setting-icon"><Trash2 size={18} /></span><div><strong>清除本机学习记录</strong><p>建议先导出备份</p></div><ChevronRight size={17} /></button>
      </section>

      <section className="privacy-note"><LockKeyhole size={18} /><p>不登录时，学习记录只保存在当前设备；开启同步后，答题、掌握画像和 AI 点评会加密传输并保存到你的“每日英语”账户。开放题文字仅在你主动提交时发送给 OpenAI API，录音不会上传。</p></section>
    </div>
  );
}

function SettingToggle({ icon, title, description, checked, onChange }: { icon: ReactNode; title: string; description: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="setting-row">
      <span className="setting-icon">{icon}</span>
      <div><strong>{title}</strong><p>{description}</p></div>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <i className="toggle" aria-hidden="true" />
    </label>
  );
}

function NavButton({ active, icon, label, badge, onClick }: { active: boolean; icon: ReactNode; label: string; badge?: number; onClick: () => void }) {
  return <button className={active ? 'active' : ''} onClick={onClick}>{icon}<span>{label}</span>{Boolean(badge) && <b>{badge! > 99 ? '99+' : badge}</b>}</button>;
}

function InstallModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <ModalShell open={open} title="安装到 iPhone" eyebrow="SAFARI PWA" onClose={onClose}>
      <div className="install-steps">
        <article><span>1</span><div><strong>用 Safari 打开正式网址</strong><p>不要在微信内置浏览器中操作。</p></div></article>
        <article><span>2</span><div><strong>点击底部“分享”按钮</strong><p>图标是一个向上的箭头。</p></div></article>
        <article><span>3</span><div><strong>选择“添加到主屏幕”</strong><p>确认名称“每日英语”，然后点击添加。</p></div></article>
      </div>
      <div className="tip-card"><strong>小提醒</strong><p>在“我的 → 多设备实时同步”中用同一邮箱登录后，不同正式域名和设备的学习记录也会自动合并。</p></div>
    </ModalShell>
  );
}

function LoadingScreen() {
  return <main className="splash-screen"><div className="splash-flower"><Flower2 size={34} /></div><h1>每日英语</h1><p>正在整理今天的五个词…</p><div className="loading-dots"><i /><i /><i /></div></main>;
}

function ErrorScreen({ message, onRetry }: { message: string; onRetry: () => void }) {
  return <main className="splash-screen error"><HeartHandshake size={38} /><h1>暂时没有打开花园</h1><p>{message}</p><button className="primary-button" onClick={onRetry}><RefreshCw size={18} />重新加载</button></main>;
}

export default App;
