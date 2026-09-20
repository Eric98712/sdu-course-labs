import { Plus, MessageSquare, Trash2, X } from 'lucide-react';
import { useState } from 'react';

interface StoredSession {
  id: string;
  title: string;
  createdAt: number;
}

interface SidebarProps {
  sessions: StoredSession[];
  currentSessionId: string;
  onNewSession: () => void;
  onSwitchSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({
  sessions,
  currentSessionId,
  onNewSession,
  onSwitchSession,
  onDeleteSession,
  open,
  onClose,
}: SidebarProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed md:relative z-40 h-full w-64 bg-math-bg-light/95 backdrop-blur-sm border-r border-white/5
                    flex flex-col transition-transform duration-300
                    ${open ? 'translate-x-0' : '-translate-x-full md:-translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-math-text-muted/50">
            对话历史
          </h2>
          <button
            onClick={onClose}
            className="md:hidden p-1 text-math-text-muted/40 hover:text-math-text transition-colors"
            aria-label="关闭侧边栏"
          >
            <X size={14} />
          </button>
        </div>

        {/* New chat button */}
        <div className="px-3 pt-3 pb-2">
          <button
            onClick={() => {
              onNewSession();
              onClose();
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-white/10
                       text-xs text-math-text-muted/60 hover:text-math-gold hover:border-math-gold/30
                       hover:bg-math-gold/5 transition-all duration-200"
          >
            <Plus size={14} />
            新建对话
          </button>
        </div>

        {/* Session list */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-2 pb-3">
          {sessions.length === 0 ? (
            <div className="text-center py-8 text-[10px] text-math-text-muted/20">
              暂无历史会话
            </div>
          ) : (
            [...sessions]
              .sort((a, b) => b.createdAt - a.createdAt)
              .map((s) => (
                <div
                  key={s.id}
                  onClick={() => {
                    onSwitchSession(s.id);
                    onClose();
                  }}
                  onMouseEnter={() => setHoveredId(s.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer mb-0.5
                              transition-all duration-150 text-xs
                              ${
                                s.id === currentSessionId
                                  ? 'bg-math-gold/10 border border-math-gold/20 text-math-gold'
                                  : 'text-math-text-muted hover:bg-white/[0.04] hover:text-math-text border border-transparent'
                              }`}
                >
                  <MessageSquare size={12} className="shrink-0 opacity-50" />
                  <span className="truncate flex-1">
                    {s.title || '新对话'}
                  </span>
                  {(hoveredId === s.id || s.id === currentSessionId) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(s.id);
                      }}
                      className="p-0.5 text-math-text-muted/30 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                      aria-label="删除会话"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-white/5">
          <div className="text-[10px] text-math-text-muted/20 text-center font-serif">
            — ∑ ∫ π ∞ —
          </div>
        </div>
      </aside>
    </>
  );
}
