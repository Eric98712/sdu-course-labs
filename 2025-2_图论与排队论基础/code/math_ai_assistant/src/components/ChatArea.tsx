import { useEffect, useRef } from 'react';
import type { ChatMessage } from '../types';
import MessageBubble from './MessageBubble';

interface ChatAreaProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export default function ChatArea({ messages, isLoading }: ChatAreaProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, messages[messages.length - 1]?.content]);

  if (messages.length === 0) return null;

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar">
      <div className="max-w-3xl mx-auto">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
