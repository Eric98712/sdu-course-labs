import { useState, useCallback, useEffect } from 'react';
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

export default function App() {
  const { sessionId, sessions, createNewSession, switchSession, saveSessionTitle, deleteSession } =
    useSession();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [tokenVersion, setTokenVersion] = useState(0);
  const [hasToken, setHasToken] = useState(!!getToken());

  const getTokenFn = useCallback(() => getToken(), [tokenVersion]);

  const { messages, isLoading, sendMessage, stopStreaming, clearChat, setMessages } = useChat(sessionId, getTokenFn);

  // when session changes, reload messages from session storage
  // For simplicity, we clear when switching to a new session
  useEffect(() => {
    clearChat();
  }, [sessionId, clearChat]);

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
    const newId = createNewSession();
    setMessages([]);
    // navigate to new session
  }, [createNewSession, setMessages]);

  const handleTokenMissing = useCallback(() => {
    setSettingsOpen(true);
  }, []);

  const handleTokenChange = useCallback(() => {
    setTokenVersion((v) => v + 1);
    setHasToken(!!getToken());
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

  const handleSwitchSession = useCallback(
    (id: string) => {
      switchSession(id);
    },
    [switchSession]
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
