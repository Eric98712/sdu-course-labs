import type { PromptItem, CozeStreamChunk, CozeSSEEvent } from '../types';

const API_BASE = '/api/coze-stream';

export async function sendStreamRequest(
  prompt: PromptItem[],
  sessionId: string,
  token: string,
  onChunk: (chunk: CozeStreamChunk) => void,
  onError: (error: string) => void,
  onFinally: () => void
): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/stream_run`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
      },
      body: JSON.stringify({
        content: { query: { prompt } },
        type: 'query',
        session_id: sessionId,
        project_id: '7642165900027641891',
      }),
    });

    if (!response.ok) {
      if (response.status === 401) onError('Token 无效或已过期，请重新配置');
      else if (response.status === 429) onError('请求过于频繁，请稍后重试');
      else onError(`请求失败 (${response.status})`);
      onFinally();
      return;
    }

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // SSE: events separated by \n\n
      const events = buffer.split('\n\n');
      buffer = events.pop() || ''; // keep incomplete event

      for (const event of events) {
        if (!event.trim()) continue;

        // extract the first "data:" line
        let dataLine: string | null = null;
        for (const line of event.split('\n')) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data:')) {
            dataLine = trimmed.slice(5).trim();
            break;
          }
        }

        if (!dataLine || dataLine === '[DONE]') continue;

        try {
          const sseEvent = JSON.parse(dataLine) as CozeSSEEvent;
          const chunk = sseEvent.content;
          if (chunk) {
            if (chunk.error) onError(chunk.error);
            onChunk(chunk);
          }
        } catch {
          // skip unparseable data
        }
      }
    }

    // process remaining buffer
    if (buffer.trim()) {
      for (const line of buffer.trim().split('\n')) {
        const trimmed = line.trim();
        if (trimmed.startsWith('data:')) {
          const jsonStr = trimmed.slice(5).trim();
          if (jsonStr && jsonStr !== '[DONE]') {
            try {
              const sseEvent = JSON.parse(jsonStr) as CozeSSEEvent;
              const chunk = sseEvent.content;
              if (chunk) {
                if (chunk.error) onError(chunk.error);
                onChunk(chunk);
              }
            } catch {
              // ignore
            }
          }
        }
      }
    }
  } catch (err) {
    if (err instanceof TypeError && err.message === 'Failed to fetch') {
      onError('网络连接失败，请检查网络');
    } else {
      onError(`连接异常: ${err instanceof Error ? err.message : '未知错误'}`);
    }
  } finally {
    onFinally();
  }
}
