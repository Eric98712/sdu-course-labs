import { useState, useCallback, useRef } from 'react';
import type { ChatMessage, PromptItem, CozeStreamChunk } from '../types';
import { sendStreamRequest } from '../utils/api';
import { compressImageToBase64 } from '../utils/image';
import { uploadImage } from '../utils/upload';

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

      // 构建用户消息气泡
      let displayText = trimmedText;
      const imageUrls: string[] = [];
      const fileNames: string[] = [];

      if (hasImages) {
        for (const file of imageFiles!) {
          imageUrls.push(URL.createObjectURL(file));
        }
        if (!displayText) displayText = `[${imageFiles!.length} 张图片]`;
      }

      if (hasDocs) {
        for (const file of docFiles!) {
          fileNames.push(file.name);
        }
        if (!displayText) {
          displayText = `[${docFiles!.length} 个文件: ${fileNames.join(', ')}]`;
        }
      }

      if (!displayText) displayText = '你好';

      // 用户消息
      const userMsg: ChatMessage = {
        id: generateMessageId(),
        role: 'user',
        content: displayText,
        imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
        fileNames: fileNames.length > 0 ? fileNames : undefined,
        timestamp: Date.now(),
      };
      appendMessage(userMsg);

      // 助手消息
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

      try {
        // 统一使用 stream_run，图片转 base64 嵌入文本 prompt
        let finalText = trimmedText || '你好';

        // 处理图片：压缩 → 上传拿到 URL → 嵌入文本 prompt
        if (hasImages) {
          if (!trimmedText) {
            finalText = '请分析以下图片中的数学内容';
          }
          for (let i = 0; i < imageFiles!.length; i++) {
            try {
              const compressed = await compressImageToBase64(imageFiles![i]);
              const blob = await (await fetch(compressed)).blob();
              const uploadFile = new File([blob], imageFiles![i].name || `img_${i}.jpg`, { type: 'image/jpeg' });
              const url = await uploadImage(uploadFile, token);
              finalText += `\n[img]${url}[/img]`;
            } catch {
              finalText += `\n[图片${i + 1}上传失败]`;
            }
          }
        }

        // 处理文档：读取文本内容拼入 prompt
        if (hasDocs) {
          if (!trimmedText && !hasImages) {
            finalText = '请分析上传的文件内容';
          }
          for (const file of docFiles!) {
            try {
              const content = await readFileAsText(file);
              finalText += `\n\n--- 文件: ${file.name} ---\n${content}`;
            } catch {
              finalText += `\n\n[文件 ${file.name} 读取失败]`;
            }
          }
        }

        const prompt: PromptItem[] = [
          { type: 'text', content: { text: finalText } },
        ];

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
          () => { setIsLoading(false); }
        );
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : '未知错误';
        setMessages((prev) => {
          const copy = [...prev];
          for (let i = copy.length - 1; i >= 0; i--) {
            if (copy[i].role === 'assistant') {
              copy[i] = { ...copy[i], content: `⚠️ ${errMsg}`, isError: true, isStreaming: false };
              return copy;
            }
          }
          return prev;
        });
        markLastAssistantError();
        setIsLoading(false);
      }
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

/**
 * 读取文件文本内容
 */
async function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target?.result as string || '');
    };
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsText(file);
  });
}
