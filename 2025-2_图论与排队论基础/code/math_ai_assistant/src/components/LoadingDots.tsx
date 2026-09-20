import { useEffect, useState } from 'react';
import { Square } from 'lucide-react';

interface LoadingDotsProps {
  onStop?: () => void;
}

export default function LoadingDots({ onStop }: LoadingDotsProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const timer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const timeStr = minutes > 0 ? `${minutes}分${seconds}秒` : `${seconds}秒`;

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <span className="inline-block text-xl text-math-gold animate-bounce-math font-serif">∑</span>
      <span className="inline-block text-xl text-math-gold animate-bounce-math-1 font-serif">∫</span>
      <span className="inline-block text-xl text-math-gold animate-bounce-math-2 font-serif">∏</span>
      <span className="ml-2 text-sm text-math-text-muted">
        {elapsed < 10 ? 'AI 思考中...' : `AI 思考中 (${timeStr})`}
      </span>

      {onStop && (
        <button
          onClick={onStop}
          className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs
                     bg-red-500/10 border border-red-500/30 text-red-400
                     hover:bg-red-500/20 hover:border-red-500/50
                     transition-all duration-200"
          aria-label="中止回复"
        >
          <Square size={12} fill="currentColor" />
          中止
        </button>
      )}
    </div>
  );
}
