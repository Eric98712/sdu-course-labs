const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, 'dist');
const PORT = 3000;
const PROXY_TARGET = 'https://9vr2hrvydc.coze.site';

const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

http.createServer((req, res) => {
  // ── API Proxy ──
  if (req.url.startsWith('/api/coze-stream/')) {
    const options = {
      hostname: '9vr2hrvydc.coze.site',
      port: 443,
      path: req.url.replace('/api/coze-stream', ''),
      method: req.method,
      headers: { ...req.headers, host: '9vr2hrvydc.coze.site' },
      rejectUnauthorized: false,
    };

    const proxyReq = https.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    });
    proxyReq.on('error', () => res.writeHead(502).end('Bad Gateway'));
    req.pipe(proxyReq);
    return;
  }

  // ── Static files ──
  let filePath = path.join(DIST, req.url === '/' ? 'index.html' : req.url);
  const ext = path.extname(filePath);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // SPA fallback
      fs.readFile(path.join(DIST, 'index.html'), (e2, d2) => {
        if (e2) { res.writeHead(404).end('Not Found'); return; }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(d2);
      });
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
