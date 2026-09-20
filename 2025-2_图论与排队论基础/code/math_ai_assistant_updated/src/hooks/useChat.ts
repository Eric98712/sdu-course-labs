import { useState, useCallback, useRef } from 'react';
import type { ChatMessage, PromptItem, CozeStreamChunk } from '../types';
import { sendStreamRequest } from '../utils/api';
import { compressImage } from '../utils/image';
import { uploadFile, isImageFile } from '../utils/upload';

function generateMessageId(): string {
  return 'msg_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
}

export function useChat(sessionId: string, getToken: () => string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef(false);

  const appendMessage = useCallback((msg: ChatMessage) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  const updateLastAssistantMessage = useCallback((content: string, isStreaming = true) => {
    setMessages((prev) => {
      const copy = [...prev];
      for (let i = copy.length - 1; i >= 0; i--) {
        if (copy[i].role === 'assistant') {
          copy[i] = { ...copy[i], content, isStreaming };
          return copy;
        }
      }
      return prev;
    });
  }, []);

  const markLastAssistantError = useCallback(() => {
    setMessages((prev) => {
      const copy = [...prev];
      for (let i = copy.length - 1; i >= 0; i--) {
        if (copy[i].role === 'assistant') {
          copy[i] = { ...copy[i], isError: true, isStreaming: false };
          return copy;
        }
      }
      return prev;
    });
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const sendMessage = useCallback(
    async (text: string, imageFiles?: File[], docFiles?: File[]) => {
      const token = getToken();
      if (!token) return;

      const hasImages = imageFiles && imageFiles.length > 0;
      const hasDocs = docFiles && docFiles.length > 0;
      const trimmedText = text.trim();

      // Build prompt items
      const prompt: PromptItem[] = [];

      // Text content
      let finalText = trimmedText;
      if (hasImages || hasDocs) {
        const parts: string[] = [];
        if (hasImages) {
          parts.push(`${imageFiles!.length}张图片`);
        }
        if (hasDocs) {
          const names = docFiles!.map(f => f.name).join('、');
          parts.push(`文档: ${names}`);
        }
        if (finalText) {
          finalText += `\n\n（已上传${parts.join('和')}，请直接分析）`;
        } else {
          finalText = `请分析我上传的${parts.join('和')}`;
        }
      }
      if (!finalText) finalText = '你好';
      prompt.push({ type: 'text', content: { text: finalText } });

      // Upload images → file_ids → add to prompt
      const imageUrls: string[] = [];
      if (hasImages) {
        for (const file of imageFiles!) {
          try {
            const result = await uploadFile(file, token);
            prompt.push({ type: 'image', content: { file_id: result.id } });
            imageUrls.push(''); // placeholder
          } catch {
            // Fallback: compress and send as data URL
            const dataUrl = await compressImage(file);
            imageUrls.push(dataUrl);
            prompt.push({ type: 'image', content: { image_url: dataUrl } });
          }
        }
      }

      // Upload documents → file_ids → add to prompt
      const fileNames: string[] = [];
      if (hasDocs) {
        for (const file of docFiles!) {
          try {
            const result = await uploadFile(file, token);
            prompt.push({ type: 'file', content: { file_id: result.id } });
            fileNames.push(file.name);
          } catch (err) {
            console.error(`文件上传失败: ${file.name}`, err);
            // 文件上传失败时提示用户
            finalText += `\n\n⚠️ 文件 "${file.name}" 上传失败`;
          }
        }
      }

      // User message bubble
      const userMsg: ChatMessage = {
        id: generateMessageId(),
        role: 'user',
        content: trimmedText || (hasImages ? `[${imageFiles!.length} 张图片]` : '') || (hasDocs ? `[${docFiles!.length} 个文件]` : ''),
        imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
        fileNames: fileNames.length > 0 ? fileNames : undefined,
        timestamp: Date.now(),
      };
      appendMessage(userMsg);

      // Empty assistant message
      const assistantMsg: ChatMessage = {
        id: generateMessageId(),
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
        isStreaming: true,
      };
      appendMessage(assistantMsg);

      setIsLoading(true);
      abortRef.current = false;

      let fullAnswer = '';

      await sendStreamRequest(
        prompt,
        sessionId,
        token,

        (chunk: CozeStreamChunk) => {
          if (abortRef.current) return;
          if (chunk.answer) {
            fullAnswer += chunk.answer;
            updateLastAssistantMessage(fullAnswer, true);
          }
          if (chunk.message_end) {
            updateLastAssistantMessage(fullAnswer, false);
          }
        },

        (error: string) => {
          if (fullAnswer) {
            updateLastAssistantMessage(fullAnswer + `\n\n⚠️ ${error}`, false);
          } else {
            setMessages((prev) => {
              const copy = [...prev];
              for (let i = copy.length - 1; i >= 0; i--) {
                if (copy[i].role === 'assistant') {
                  copy[i] = { ...copy[i], content: `⚠️ ${error}`, isError: true, isStreaming: false };
                  return copy;
                }
              }
              return prev;
            });
          }
          markLastAssistantError();
        },

        () => {
          setIsLoading(false);
        }
      );
    },
    [sessionId, getToken, appendMessage, updateLastAssistantMessage, markLastAssistantError]
  );

  const stopStreaming = useCallback(() => {
    abortRef.current = true;
    setIsLoading(false);
    setMessages((prev) => {
      const copy = [...prev];
      for (let i = copy.length - 1; i >= 0; i--) {
        if (copy[i].role === 'assistant') {
          copy[i] = { ...copy[i], isStreaming: false };
          break;
        }
      }
      return copy;
    });
  }, []);

  const clearChat = useCallback(() => {
    abortRef.current = true;
    clearMessages();
  }, [clearMessages]);

  return {
    messages,
    isLoading,
    sendMessage,
    stopStreaming,
    clearChat,
    setMessages,
  };
}
