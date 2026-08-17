import { LockKeyhole, ShieldCheck } from 'lucide-react';
import { ModalShell } from './ModalShell';

interface PrivacyConsentModalProps {
  open: boolean;
  onClose: () => void;
  onAccept: () => Promise<void>;
}

export function PrivacyConsentModal({ open, onClose, onAccept }: PrivacyConsentModalProps) {
  return (
    <ModalShell
      open={open}
      title="开启 AI 辅助点评"
      eyebrow="第一次使用前"
      onClose={onClose}
      footer={
        <div className="split-actions">
          <button className="secondary-button" onClick={onClose}>暂不开启</button>
          <button className="primary-button inline" onClick={() => void onAccept()}><ShieldCheck size={18} />同意并继续</button>
        </div>
      }
    >
      <div className="consent-illustration"><LockKeyhole size={30} /></div>
      <div className="consent-copy">
        <p>开放式回答无法只靠固定答案可靠判断。开启后，当前题目的文字答案、目标词和必要评分规则会发送到 OpenAI API，由 GPT-5 mini 辅助评分。</p>
        <ul>
          <li>不会发送姓名、邮箱或全部学习历史。</li>
          <li>首版录音只保存在本机，不上传。</li>
          <li>不开启也能继续使用词卡、复习和所有客观题。</li>
          <li>你可以随时在“我的”页面关闭。</li>
        </ul>
      </div>
    </ModalShell>
  );
}
