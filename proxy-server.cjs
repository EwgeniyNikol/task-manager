const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = 3000;

app.use('/api', createProxyMiddleware({
  target: 'http://localhost:3001',
  changeOrigin: true,
  pathRewrite: { '^/api': '' },
}));

app.use(express.static(path.join(__dirname, 'dist')));

app.all('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log('🚀 Production сервер запущен!');
  console.log(`📁 Frontend: http://localhost:${PORT}`);
  console.log(`🔌 API: http://localhost:${PORT}/api/tasks`);
  console.log(`⚙️  Backend: http://localhost:3001/tasks`);
  console.log('\n✅ Откройте браузер: http://localhost:3000');
});
