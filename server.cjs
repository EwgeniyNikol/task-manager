const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Прокси для API запросов к json-server
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:3001',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '', // убираем /api при проксировании
  },
}));

// Раздача статических файлов из dist
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback для SPA - отдаем index.html для всех остальных запросов
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

console.log('Запуск json-server...');
const { exec } = require('child_process');

// Запускаем json-server отдельно
exec('npx json-server --watch db.json --port 3001', (error, stdout, stderr) => {
  if (error) {
    console.error('Ошибка запуска json-server:', error);
    return;
  }
  if (stderr) {
    console.error('stderr:', stderr);
  }
  console.log('json-server stdout:', stdout);
});

// Запускаем Express сервер
app.listen(PORT, () => {
  console.log(`=== Сервер запущен ===`);
  console.log(`Frontend: http://localhost:${PORT}`);
  console.log(`API:      http://localhost:${PORT}/api/tasks`);
  console.log(`Backend:  http://localhost:3001/tasks`);
  console.log(`=====================`);
});

// Обработка завершения процесса
process.on('SIGINT', () => {
  console.log('Завершение работы...');
  process.exit();
});
