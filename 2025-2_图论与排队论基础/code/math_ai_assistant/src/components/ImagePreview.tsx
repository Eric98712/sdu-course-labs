import { X } from 'lucide-react';

interface ImagePreviewProps {
  images: { file: File; preview: string }[];
  onRemove: (index: number) => void;
}

export default function ImagePreview({ images, onRemove }: ImagePreviewProps) {
  if (images.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-2">
      {images.map((img, i) => (
        <div key={i} className="relative group">
          <img
            src={img.preview}
            alt={`上传图片 ${i + 1}`}
            className="h-20 w-auto rounded-lg border border-math-gold/30 object-cover"
          />
          <button
            onClick={() => onRemove(i)}
            className="absolute -top-2 -right-2 p-0.5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label={`移除图片 ${i + 1}`}
          >
            <X size={14} />
          </button>
          {images.length > 1 && (
            <span className="absolute bottom-1 left-1 px-1 py-0.5 text-[10px] bg-black/60 rounded text-white/70">
              {i + 1}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
