const API_BASE = '/api/coze-stream';

export async function uploadImage(file: File, token: string): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/upload/image`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    if (response.status === 401) throw new Error('Token 无效，上传失败');
    if (response.status === 413) throw new Error('文件过大');
    throw new Error(`上传失败 (${response.status})`);
  }

  const data = await response.json();
  return data.url as string;
}
