/**
 * 将图片文件压缩并转为 base64 data URL
 * 用于嵌入 stream_run 的文本 prompt 中，让 AI 直接识别图片内容
 */
export function compressImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        const maxDim = 1024;
        if (width > maxDim || height > maxDim) {
          const ratio = Math.min(maxDim / width, maxDim / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, width, height);
        let quality = 0.8;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);
        // 如果 base64 太大，逐步降低质量
        while (dataUrl.length > 2 * 1024 * 1024 && quality > 0.3) {
          quality = Math.round((quality - 0.1) * 10) / 10;
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('图片加载失败'));
      img.src = e.target!.result as string;
    };
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsDataURL(file);
  });
}

/**
 * 兼容旧调用：返回 data URL
 */
export function compressImage(file: File): Promise<string> {
  return compressImageToBase64(file);
}
