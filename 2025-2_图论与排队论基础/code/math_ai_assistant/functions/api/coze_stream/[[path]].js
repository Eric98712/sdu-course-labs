const COZE_API = 'https://9vr2hrvydc.coze.site';

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const targetUrl = COZE_API + url.pathname.replace('/api/coze-stream', '');

  const headers = new Headers(request.headers);
  headers.set('Host', new URL(COZE_API).host);

  const response = await fetch(targetUrl, {
    method: request.method,
    headers,
    body: request.body,
  });

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
}
