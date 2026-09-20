import { useState } from 'react';
import { Copy, Check, AlertTriangle } from 'lucide-react';
import type { ChatMessage } from '../types';
import ToolOutputRenderer from './ToolOutputRenderer';

interface MessageBubbleProps {
  message: ChatMessage;
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API not available
    }
  };

  if (message.role === 'user') {
    return (
      <div className="flex justify-end mb-4 animate-fade-in">
        <div className="max-w-[75%]">
          {message.imageUrls && message.imageUrls.length > 0 && (
            <div className="mb-2 flex justify-end gap-1.5 flex-wrap">
              {message.imageUrls.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`用户上传 ${i + 1}`}
                  className="max-h-36 rounded-lg border border-white/10"
                />
              ))}
            </div>
          )}
          {message.content && (
            <div
              className="px-4 py-2.5 rounded-2xl rounded-br-sm bg-gradient-to-r from-math-blue/20 to-math-purple/20
                         border border-math-blue/20 text-math-text text-sm leading-relaxed"
            >
              {message.content}
            </div>
          )}
          <div className="text-[10px] text-math-text-muted/40 text-right mt-1 mr-1">
            {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    );
  }

  // AI message
  return (
    <div className="flex justify-start mb-4 animate-fade-in">
      <div className="max-w-[80%] group">
        <div
          className={`relative px-4 py-3 rounded-lg rounded-bl-sm bg-math-card/60
                      border-l-2 border-math-gold/60
                      ${message.isError ? 'border-red-400' : ''}
                      ${message.isStreaming ? 'animate-pulse-glow' : ''}`}
        >
          {/* QED dot */}
          <span className="absolute -top-1 -left-1 text-[8px] text-math-gold opacity-40">∎</span>

          {/* streaming cursor */}
          {message.content ? (
            <ToolOutputRenderer content={message.content} />
          ) : message.isStreaming ? (
            <span className="inline-block w-2 h-4 bg-math-gold animate-pulse" />
          ) : null}

          {message.isStreaming && message.content && (
            <span className="inline-block w-2 h-4 bg-math-gold animate-pulse ml-0.5 align-text-bottom" />
          )}

          {message.isError && !message.isStreaming && (
            <div className="flex items-center gap-1.5 mt-2 text-xs text-red-400">
              <AlertTriangle size={12} />
              <span>回复可能不完整</span>
            </div>
          )}

          {/* copy button */}
          {!message.isStreaming && message.content && (
            <button
              onClick={handleCopy}
              className="absolute -bottom-5 right-0 p-1 text-math-text-muted/30 hover:text-math-gold/60
                         opacity-0 group-hover:opacity-100 transition-all duration-200"
              aria-label="复制回复"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          )}
        </div>
        <div className="text-[10px] text-math-text-muted/40 mt-1 ml-1">
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
}
