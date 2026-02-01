const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('=== Task Manager - Production Start ===\n');

// Проверяем, установлены ли зависимости
if (!fs.existsSync('node_modules')) {
  console.log('📦 Установка зависимостей...');
  execSync('npm install', { stdio: 'inherit' });
}

// Сборка фронтенда
console.log('🔨 Сборка фронтенда...');
execSync('npm run build', { stdio: 'inherit' });

// Проверяем наличие db.json
if (!fs.existsSync('db.json')) {
  console.log('📝 Создание начальной базы данных...');
  fs.writeFileSync('db.json', JSON.stringify({ tasks: [] }, null, 2));
}

console.log('\n🚀 Запуск production сервера...');
console.log('\n===========================================');
console.log('Приложение запускается на порту 3000');
console.log('Фронтенд: http://localhost:3000');
console.log('API:      http://localhost:3003/tasks');
console.log('===========================================');
console.log('\nДля остановки нажмите Ctrl+C\n');

// Запускаем server.cjs
require('./server.cjs');
