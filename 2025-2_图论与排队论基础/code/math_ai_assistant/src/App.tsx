import { useState, useCallback, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import InputArea from './components/InputArea';
import WelcomeScreen from './components/WelcomeScreen';
import LoadingDots from './components/LoadingDots';
import SettingsModal from './components/SettingsModal';
import MathBackground from './components/MathBackground';
import { useChat } from './hooks/useChat';
import { useSession } from './hooks/useSession';
import { getToken } from './utils/storage';
import { computeUserId } from './utils/userId';

export default function App() {
  const { sessionId, sessions, createNewSession, switchSession, saveSessionTitle, deleteSession, saveMessages, loadMessages } =
    useSession();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [tokenVersion, setTokenVersion] = useState(0);
  const [hasToken, setHasToken] = useState(!!getToken());
  const [userId, setUserId] = useState<string | undefined>(undefined);

  // Compute userId from stored token on mount
  useEffect(() => {
    const token = getToken();
    if (token) {
      computeUserId(token).then(setUserId);
    }
  }, []);

  const getTokenFn = useCallback(() => getToken(), [tokenVersion]);

  const { messages, isLoading, sendMessage, stopStreaming, clearChat, setMessages } = useChat(sessionId, getTokenFn);

  const prevSessionRef = useRef(sessionId);
  const msgsOwnerRef = useRef(sessionId);

  // When sessionId changes externally (user clicks sidebar), load target messages
  useEffect(() => {
    if (prevSessionRef.current !== sessionId) {
      const stored = loadMessages(sessionId);
      setMessages(stored);
      msgsOwnerRef.current = sessionId;
      prevSessionRef.current = sessionId;
    }
  }, [sessionId, loadMessages, setMessages]);

  // Auto-save — only save when current messages actually belong to current session
  useEffect(() => {
    if (messages.length > 0 && msgsOwnerRef.current === sessionId) {
      saveMessages(sessionId, messages);
    }
  }, [messages, sessionId, saveMessages]);

  // save session title from first user message
  useEffect(() => {
    const firstUserMsg = messages.find((m) => m.role === 'user');
    if (firstUserMsg && firstUserMsg.content) {
      const title = firstUserMsg.content.slice(0, 40) + (firstUserMsg.content.length > 40 ? '...' : '');
      saveSessionTitle(sessionId, title);
    }
  }, [messages, sessionId, saveSessionTitle]);

  const handleSend = useCallback(
    async (text: string, imageFiles?: File[], docFiles?: File[]) => {
      await sendMessage(text, imageFiles, docFiles);
    },
    [sendMessage]
  );

  const handleNewSession = useCallback(() => {
    saveMessages(sessionId, messages); // save old session first
    const newId = createNewSession();
    setMessages([]);
  }, [createNewSession, setMessages, saveMessages, sessionId, messages]);

  const handleSwitchSession = useCallback(
    (id: string) => {
      saveMessages(sessionId, messages); // save current session before switching
      switchSession(id);
    },
    [switchSession, saveMessages, sessionId, messages]
  );

  const handleTokenMissing = useCallback(() => {
    setSettingsOpen(true);
  }, []);

  const handleTokenChange = useCallback((newUserId?: string) => {
    setTokenVersion((v) => v + 1);
    setHasToken(!!getToken());
    if (newUserId !== undefined) setUserId(newUserId);
  }, []);

  const handleSelectExample = useCallback(
    (text: string) => {
      if (!hasToken) {
        setSettingsOpen(true);
        return;
      }
      sendMessage(text);
    },
    [hasToken, sendMessage]
  );

  return (
    <div className="h-screen flex flex-col bg-math-bg text-math-text overflow-hidden">
      <MathBackground />

      {/* Main layout */}
      <div className="flex flex-1 relative z-10 min-h-0">
        {/* Sidebar */}
        <Sidebar
          sessions={sessions}
          currentSessionId={sessionId}
          onNewSession={handleNewSession}
          onSwitchSession={handleSwitchSession}
          onDeleteSession={deleteSession}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar
            hasToken={hasToken}
            userId={userId}
            sessionId={sessionId}
            onNewSession={handleNewSession}
            onOpenSettings={() => setSettingsOpen(true)}
            onToggleSidebar={() => setSidebarOpen((v) => !v)}
          />

          {/* Chat area or welcome */}
          {messages.length === 0 && !isLoading ? (
            <WelcomeScreen onSelectExample={handleSelectExample} />
          ) : (
            <ChatArea messages={messages} isLoading={isLoading} />
          )}

          {/* Loading indicator with stop button */}
          {isLoading && (
            <div className="px-4 pb-2">
              <div className="max-w-3xl mx-auto">
                <LoadingDots onStop={stopStreaming} />
              </div>
            </div>
          )}

          <InputArea
            onSend={handleSend}
            isLoading={isLoading}
            hasToken={hasToken}
            onTokenMissing={handleTokenMissing}
          />
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onTokenChange={handleTokenChange}
      />
    </div>
  );
}
