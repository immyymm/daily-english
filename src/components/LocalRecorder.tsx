import { Mic, Square, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface LocalRecorderProps {
  onStarted?: (latencyMs: number) => void;
  shownAt: number;
}

export function LocalRecorder({ onStarted, shownAt }: LocalRecorderProps) {
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string>();
  const [error, setError] = useState<string>();

  useEffect(() => () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    recorderRef.current?.stream.getTracks().forEach((track) => track.stop());
  }, [audioUrl]);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((track) => track.stop());
      };
      recorderRef.current = recorder;
      recorder.start();
      setRecording(true);
      setError(undefined);
      onStarted?.(Date.now() - shownAt);
    } catch {
      setError('无法使用麦克风。你仍可以直接输入或确认文字稿。');
    }
  };

  const stop = () => {
    recorderRef.current?.stop();
    setRecording(false);
  };

  const clear = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(undefined);
  };

  return (
    <div className="recorder-card">
      <div>
        <strong>本地口语草稿</strong>
        <p>录音不会上传；请在下方输入或确认文字稿。</p>
      </div>
      <div className="recorder-actions">
        {!recording && !audioUrl && <button onClick={() => void start()}><Mic size={17} />开始录音</button>}
        {recording && <button className="recording" onClick={stop}><Square size={16} />停止</button>}
        {audioUrl && (
          <>
            <audio controls src={audioUrl} aria-label="本地录音回放" />
            <button className="icon-button small" onClick={clear} aria-label="删除录音"><Trash2 size={16} /></button>
          </>
        )}
      </div>
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}
