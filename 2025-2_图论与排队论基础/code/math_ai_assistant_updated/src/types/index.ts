export interface PromptTextItem {
  type: 'text';
  content: { text: string };
}

export interface PromptImageItem {
  type: 'image';
  content: { image_url: string } | { file_id: string };
}

export interface PromptFileItem {
  type: 'file';
  content: { file_id: string };
}

export type PromptItem = PromptTextItem | PromptImageItem | PromptFileItem;

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  imageUrls?: string[];
  fileNames?: string[];
  timestamp: number;
  isStreaming?: boolean;
  isError?: boolean;
}

export interface Session {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

// Coze stream response chunk (nested inside SSE data.content)
export interface CozeStreamChunk {
  answer: string | null;
  thinking: string | null;
  tool_request: unknown | null;
  tool_response: unknown | null;
  error: string | null;
  message_start: Record<string, unknown> | null;
  message_end: Record<string, unknown> | null;
}

// SSE event wrapper from Coze
export interface CozeSSEEvent {
  type: 'message_start' | 'answer' | 'message_end';
  content: CozeStreamChunk;
  finish: boolean;
  session_id: string;
  sequence_id: number;
  msg_id: string;
  reply_id: string;
  log_id: string;
}

export interface ExampleQuestion {
  icon: string;
  text: string;
}
