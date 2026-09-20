import { useState, useCallback } from 'react';
import type { ChatMessage } from '../types';

const SESSIONS_KEY = 'math_ai_sessions';
const MESSAGES_PREFIX = 'math_ai_messages_';

interface StoredSession {
  id: string;
  title: string;
  createdAt: number;
}

function generateId(): string {
  return 'sess_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
}

export function useSession() {
  const [sessionId, setSessionId] = useState<string>(() => generateId());
  const [sessions, setSessions] = useState<StoredSession[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(SESSIONS_KEY) || '[]');
    } catch {
      return [];
    }
  });

  // ─── Message persistence per session ───

  const saveMessages = useCallback((id: string, messages: ChatMessage[]) => {
    try {
      localStorage.setItem(MESSAGES_PREFIX + id, JSON.stringify(messages));
    } catch {
      // localStorage full, ignore
    }
  }, []);

  const loadMessages = useCallback((id: string): ChatMessage[] => {
    try {
      const raw = localStorage.getItem(MESSAGES_PREFIX + id);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }, []);

  // ─── Session CRUD ───

  const createNewSession = useCallback(() => {
    const newId = generateId();
    setSessionId(newId);
    return newId;
  }, []);

  const switchSession = useCallback((id: string) => {
    setSessionId(id);
  }, []);

  const saveSessionTitle = useCallback((id: string, title: string) => {
    setSessions((prev) => {
      const existing = prev.find((s) => s.id === id);
      if (existing) {
        existing.title = title;
      } else {
        prev.push({ id, title, createdAt: Date.now() });
      }
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(prev));
      return [...prev];
    });
  }, []);

  const deleteSession = useCallback((id: string) => {
    localStorage.removeItem(MESSAGES_PREFIX + id);
    setSessions((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(filtered));
      return filtered;
    });
    if (sessionId === id) {
      const newId = generateId();
      setSessionId(newId);
    }
  }, [sessionId]);

  return {
    sessionId,
    sessions,
    createNewSession,
    switchSession,
    saveSessionTitle,
    deleteSession,
    saveMessages,
    loadMessages,
  };
}
