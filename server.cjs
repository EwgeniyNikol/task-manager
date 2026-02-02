const express = require('express');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

console.log('🔄 Запуск json-server API...');
const jsonServer = spawn('npx', ['json-server', '--watch', 'db.json', '--port', '3003', '--host', 'localhost'], {
  stdio: 'inherit',
  shell: true
});

jsonServer.on('error', (err) => {
  console.error('❌ Не удалось запустить json-server:', err);
  process.exit(1);
});

app.use('/api', (req, res) => {
  const http = require('http');
  const options = {
    hostname: 'localhost',
    port: 3003,
    path: req.url,
    method: req.method,
    headers: req.headers
  };
  
  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });
  
  req.pipe(proxyReq);
});

app.use(express.static(path.join(__dirname, 'dist')));

app.use((req, res, next) => {
  const filePath = path.join(__dirname, 'dist', req.path);
  
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      return res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    }
    next();
  });
});

app.listen(PORT, () => {
  console.log(`✅ Сервер запущен на порту ${PORT}`);
  console.log(`🌐 Фронтенд: http://localhost:${PORT}`);
  console.log(`🔗 API: http://localhost:3003/tasks`);
  console.log('\nДля остановки нажмите Ctrl+C');
});

process.on('SIGINT', () => {
  console.log('\n🛑 Остановка...');
  jsonServer.kill();
  process.exit(0);
});
