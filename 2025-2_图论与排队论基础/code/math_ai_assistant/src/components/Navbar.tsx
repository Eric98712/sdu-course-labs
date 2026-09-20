import { useState } from 'react';
import { Menu, Plus, Settings, Infinity, User, Copy, Check } from 'lucide-react';

interface NavbarProps {
  hasToken: boolean;
  userId?: string;
  sessionId: string;
  onNewSession: () => void;
  onOpenSettings: () => void;
  onToggleSidebar: () => void;
}

export default function Navbar({
  hasToken,
  userId,
  sessionId,
  onNewSession,
  onOpenSettings,
  onToggleSidebar,
}: NavbarProps) {
  const [navCopied, setNavCopied] = useState(false);
  const handleCopyId = async () => {
    if (!userId) return;
    try {
      await navigator.clipboard.writeText(userId);
      setNavCopied(true);
      setTimeout(() => setNavCopied(false), 2000);
    } catch { /* ignore */ }
  };
  return (
    <header className="border-b border-white/5 bg-math-bg/90 backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 py-2.5">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-1.5 rounded-lg hover:bg-white/5 text-math-text-muted/50 hover:text-math-text transition-colors"
            aria-label="切换侧边栏"
          >
            <Menu size={18} />
          </button>
          <div className="flex items-center gap-2">
            <Infinity size={20} className="text-math-gold" />
            <h1 className="text-sm font-semibold text-math-text font-serif tracking-wide">
              数学考研助手
            </h1>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <button
            onClick={onNewSession}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-math-text-muted/70
                       hover:text-math-gold hover:bg-math-gold/5 transition-colors"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">新建对话</span>
          </button>

          <div className="w-px h-4 bg-white/5 mx-1" />

          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-lg hover:bg-white/5 transition-colors relative"
            aria-label="设置"
          >
            <Settings size={16} className="text-math-text-muted/50 hover:text-math-text transition-colors" />
            <span
              className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full border border-math-bg
                          ${hasToken ? 'bg-green-400' : 'bg-red-400'}`}
            />
          </button>

          {/* User ID (clickable, copies to clipboard) */}
          {userId && (
            <button
              onClick={handleCopyId}
              className="hidden lg:flex items-center gap-1.5 text-[10px] text-math-text-muted/30 ml-2 font-mono hover:text-math-gold/60 transition-colors"
              title="点击复制用户 ID"
            >
              <User size={11} className="text-math-gold/50" />
              <span>{userId}</span>
              {navCopied ? (
                <Check size={10} className="text-green-400" />
              ) : (
                <Copy size={10} className="opacity-40" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Math symbol decoration line */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-math-gold/20 to-transparent relative">
        <div className="absolute inset-0 flex items-center justify-center gap-2 text-[8px] text-math-gold/20 font-serif tracking-[0.3em]">
          — ∑ — ∫ — π — ∞ — √ — Δ —
        </div>
      </div>
    </header>
  );
}
