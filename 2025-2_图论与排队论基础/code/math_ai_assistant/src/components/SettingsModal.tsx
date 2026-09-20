import { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Key, User, Copy, Check } from 'lucide-react';
import { getToken, setToken, clearToken } from '../utils/storage';
import { computeUserId } from '../utils/userId';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  onTokenChange: (userId?: string) => void;
}

export default function SettingsModal({ open, onClose, onTokenChange }: SettingsModalProps) {
  const [inputValue, setInputValue] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [saved, setSaved] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      const existing = getToken();
      setInputValue(existing || '');
      setHasToken(!!existing);
      setSaved(false);
      if (existing) {
        computeUserId(existing).then(setUserId);
      } else {
        setUserId(null);
      }
    }
  }, [open]);

  const handleSave = async () => {
    const trimmed = inputValue.trim();
    let newUserId: string | null = null;
    if (trimmed) {
      setToken(trimmed);
      setHasToken(true);
      newUserId = await computeUserId(trimmed);
      setUserId(newUserId);
    } else {
      clearToken();
      setHasToken(false);
      setUserId(null);
    }
    setSaved(true);
    onTokenChange(newUserId || undefined);
    setTimeout(() => onClose(), 800);
  };

  const handleClear = () => {
    clearToken();
    setInputValue('');
    setHasToken(false);
    setUserId(null);
    setSaved(true);
    onTokenChange(undefined);
    setTimeout(() => onClose(), 800);
  };

  const [copied, setCopied] = useState(false);
  const handleCopyUserId = async () => {
    if (userId) {
      try {
        await navigator.clipboard.writeText(userId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch { /* ignore */ }
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-math-bg-light border border-white/10 rounded-2xl w-full max-w-md mx-4 shadow-2xl
                   animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Key size={16} className="text-math-gold" />
            <h2 className="text-sm font-semibold text-math-text">API 配置</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/5 text-math-text-muted/50 hover:text-math-text transition-colors"
            aria-label="关闭"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {/* Status indicator */}
          <div className="flex items-center gap-2 mb-4">
            <span
              className={`w-2 h-2 rounded-full ${hasToken ? 'bg-green-400' : 'bg-red-400'}`}
            />
            <span className="text-xs text-math-text-muted">
              {hasToken ? '已配置 Token' : '未配置 Token'}
            </span>
          </div>

          {/* Input */}
          <div className="relative">
            <input
              type={showToken ? 'text' : 'password'}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="输入你的 API Token"
              className="w-full bg-math-bg/60 border border-white/10 rounded-xl px-4 py-2.5 pr-10
                         text-sm text-math-text placeholder-math-text-muted/30
                         focus:outline-none focus:border-math-gold/50 focus:ring-1 focus:ring-math-gold/20
                         transition-all duration-200"
            />
            <button
              onClick={() => setShowToken(!showToken)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-math-text-muted/40 hover:text-math-text-muted transition-colors"
              aria-label={showToken ? '隐藏 Token' : '显示 Token'}
            >
              {showToken ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <p className="mt-2 text-[10px] text-math-text-muted/30 leading-relaxed">
            Token 仅存储在本地浏览器 localStorage 中，请妥善保管。
          </p>

          {saved && (
            <div className="mt-3 text-xs text-green-400 animate-fade-in">
              ✓ {hasToken ? 'Token 已保存' : 'Token 已清除'}
            </div>
          )}

          {/* User ID display */}
          {hasToken && userId && (
            <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-math-gold/5 border border-math-gold/15">
              <User size={14} className="text-math-gold/70 shrink-0" />
              <div className="flex-1 text-xs">
                <span className="text-math-text-muted">用户 ID: </span>
                <span className="text-math-gold font-mono tracking-wide">{userId}</span>
              </div>
              <button
                onClick={handleCopyUserId}
                className="p-1 rounded hover:bg-math-gold/10 text-math-gold/60 hover:text-math-gold transition-colors"
                aria-label="复制用户 ID"
                title="复制"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-white/5">
          <button
            onClick={handleClear}
            className="px-4 py-1.5 text-xs text-math-text-muted/50 hover:text-red-400 transition-colors"
          >
            清除
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-1.5 text-xs font-medium rounded-lg bg-math-gold text-math-bg
                       hover:bg-math-gold-dark transition-colors"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
