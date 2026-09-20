const FILE_UPLOAD_URL = '/api/coze-up/v1/files/upload';

export interface CozeFileResult {
  id: string;
  name: string;
  size: number;
  mime_type: string;
}

export async function uploadFile(
  file: File,
  token: string
): Promise<CozeFileResult> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(FILE_UPLOAD_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    if (response.status === 401) throw new Error('Token 缺少 uploadFile 权限');
    if (response.status === 413) throw new Error('文件过大，最大支持 512MB');
    throw new Error(`上传失败 (${response.status})`);
  }

  const data = await response.json();
  return data.data as CozeFileResult;
}

// 支持的文件格式
export const IMAGE_TYPES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
];

export const DOC_EXTENSIONS = [
  '.pdf', '.doc', '.docx', '.xls', '.xlsx',
  '.ppt', '.pptx', '.csv', '.txt',
];

export const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

export function isImageFile(file: File): boolean {
  return IMAGE_TYPES.includes(file.type);
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
