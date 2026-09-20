import { useState, useRef, useCallback } from 'react';
import { Send, ImagePlus, Paperclip, FileText } from 'lucide-react';
import ImagePreview from './ImagePreview';

interface InputAreaProps {
  onSend: (text: string, imageFiles?: File[], docFiles?: File[]) => void;
  isLoading: boolean;
  hasToken: boolean;
  onTokenMissing: () => void;
}

const MAX_CHARS = 2000;
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
const DOC_EXTENSIONS = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.csv', '.txt'];

export default function InputArea({ onSend, isLoading, hasToken, onTokenMissing }: InputAreaProps) {
  const [text, setText] = useState('');
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [docs, setDocs] = useState<{ file: File }[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const addImages = useCallback((fileList: FileList | null) => {
    if (!fileList) return;
    const newImages: { file: File; preview: string }[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (file.size > 5 * 1024 * 1024) {
        alert(`"${file.name}" 超过 5MB，请压缩后重试`);
        continue;
      }
      if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) continue;
      newImages.push({
        file,
        preview: URL.createObjectURL(file),
      });
    }

    setImages((prev) => [...prev, ...newImages]);
  }, []);

  const addDocs = useCallback((fileList: FileList | null) => {
    if (!fileList) return;
    const newDocs: { file: File }[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (file.size > 512 * 1024 * 1024) {
        alert(`"${file.name}" 超过 512MB`);
        continue;
      }
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!DOC_EXTENSIONS.includes(ext)) {
        alert(`"${file.name}" 格式不支持，仅支持: ${DOC_EXTENSIONS.join(', ')}`);
        continue;
      }
      newDocs.push({ file });
    }

    setDocs((prev) => [...prev, ...newDocs]);
  }, []);

  const handleImageSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      addImages(e.target.files);
      e.target.value = '';
    },
    [addImages]
  );

  const handleDocSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      addDocs(e.target.files);
      e.target.value = '';
    },
    [addDocs]
  );

  const handleRemoveImage = useCallback((index: number) => {
    setImages((prev) => {
      const removed = prev[index];
      if (removed) URL.revokeObjectURL(removed.preview);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const handleRemoveDoc = useCallback((index: number) => {
    setDocs((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSend = useCallback(async () => {
    const trimmed = text.trim();
    if (!trimmed && images.length === 0 && docs.length === 0) return;
    if (!hasToken) {
      onTokenMissing();
      return;
    }

    const imgFiles = images.map((img) => img.file);
    const docFiles = docs.map((d) => d.file);
    onSend(trimmed, imgFiles.length > 0 ? imgFiles : undefined, docFiles.length > 0 ? docFiles : undefined);
    setText('');
    images.forEach((img) => URL.revokeObjectURL(img.preview));
    setImages([]);
    setDocs([]);
    textareaRef.current?.focus();
  }, [text, images, docs, hasToken, onSend, onTokenMissing]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const charCount = text.length;
  const canSend = (text.trim() || images.length > 0 || docs.length > 0) && !isLoading;

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      const items = e.clipboardData.files;
      if (items.length > 0) {
        addImages(items);
      }
    },
    [addImages]
  );

  const totalAttachments = images.length + docs.length;

  return (
    <div className="border-t border-white/5 bg-math-bg/95 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-4 py-3">
        {/* Image previews */}
        <ImagePreview images={images} onRemove={handleRemoveImage} />

        {/* Document file list */}
        {docs.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {docs.map((doc, i) => (
              <div key={i} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-math-card/80 border border-white/10 text-xs text-math-text group">
                <FileText size={14} className="text-math-gold/70 shrink-0" />
                <span className="max-w-[140px] truncate">{doc.file.name}</span>
                <span className="text-math-text-muted/40">
                  {(doc.file.size / 1024).toFixed(0)}KB
                </span>
                <button
                  onClick={() => handleRemoveDoc(i)}
                  className="ml-1 text-math-text-muted/40 hover:text-red-400 transition-colors"
                  aria-label={`移除 ${doc.file.name}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload count hint */}
        {totalAttachments > 0 && (
          <div className="mb-2 text-[10px] text-math-text-muted/40">
            已选 {images.length > 0 ? `${images.length} 张图片` : ''}
            {images.length > 0 && docs.length > 0 ? '、' : ''}
            {docs.length > 0 ? `${docs.length} 个文件` : ''}
          </div>
        )}

        {/* Input row */}
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => {
                if (e.target.value.length <= MAX_CHARS) setText(e.target.value);
              }}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              placeholder="输入你的数学问题... (Shift+Enter 换行，Ctrl+V 粘贴图片)"
              rows={1}
              className="w-full bg-math-card/80 border border-white/10 rounded-xl px-4 py-2.5 pr-16
                         text-sm text-math-text placeholder-math-text-muted/40
                         focus:outline-none focus:border-math-gold/50 focus:ring-1 focus:ring-math-gold/20
                         resize-none transition-all duration-200
                         custom-scrollbar"
              style={{ minHeight: '42px', maxHeight: '120px' }}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = 'auto';
                el.style.height = Math.min(el.scrollHeight, 120) + 'px';
              }}
            />
            <div className="absolute right-3 bottom-2.5 text-[10px] text-math-text-muted/30 select-none">
              {charCount}/{MAX_CHARS}
            </div>
          </div>

          {/* File upload button (documents) */}
          <button
            onClick={() => docInputRef.current?.click()}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-white/10 text-math-text-muted/50
                       hover:text-math-gold hover:border-math-gold/30 hover:bg-math-gold/5
                       disabled:opacity-30 transition-all duration-200 relative"
            aria-label="上传文件"
            title="上传文档 (PDF/Word/Excel/PPT等)"
          >
            <Paperclip size={20} />
            {docs.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-500 text-[9px] text-white font-bold flex items-center justify-center">
                {docs.length}
              </span>
            )}
          </button>
          <input
            ref={docInputRef}
            type="file"
            multiple
            accept={DOC_EXTENSIONS.join(',')}
            onChange={handleDocSelect}
            className="hidden"
          />

          {/* Image upload button */}
          <button
            onClick={() => imageInputRef.current?.click()}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-white/10 text-math-text-muted/50
                       hover:text-math-gold hover:border-math-gold/30 hover:bg-math-gold/5
                       disabled:opacity-30 transition-all duration-200 relative"
            aria-label="上传图片"
            title="上传图片（支持多选）"
          >
            <ImagePlus size={20} />
            {images.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-math-gold text-[9px] text-math-bg font-bold flex items-center justify-center">
                {images.length}
              </span>
            )}
          </button>
          <input
            ref={imageInputRef}
            type="file"
            multiple
            accept={IMAGE_EXTENSIONS.join(',')}
            onChange={handleImageSelect}
            className="hidden"
          />

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={!canSend}
            className="p-2.5 rounded-xl bg-gradient-to-r from-math-gold to-math-gold-dark
                       text-math-bg font-medium shadow-lg shadow-math-gold/20
                       hover:shadow-math-gold/40 hover:from-math-gold-dark hover:to-math-gold
                       disabled:opacity-30 disabled:cursor-not-allowed
                       transition-all duration-200 relative group"
            aria-label="发送"
          >
            <Send size={18} />
            <span className="absolute inset-0 rounded-xl border border-math-gold/0 group-hover:border-math-gold/40
                           group-hover:animate-spin-slow pointer-events-none" />
          </button>
        </div>

        {/* Hint */}
        {!hasToken && (
          <div className="mt-2 text-center">
            <span className="text-xs text-amber-400/70">
              ⚠️ 请先点击右上角齿轮图标配置 API Token
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
