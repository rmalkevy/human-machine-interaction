// server.js
const http = require('http');
const WebSocket = require('ws');

// створюємо HTTP сервер (просто оболонка)
const server = http.createServer();
const wss = new WebSocket.Server({ server });

const PORT = 3001;

// коли новий клієнт підключається
wss.on('connection', (ws) => {
  console.log('Новий клієнт підключився');

  ws.on('message', (data) => {
    console.log('Отримано:', data.toString());

    // надсилаємо всім іншим клієнтам
    for (const client of wss.clients) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data.toString());
      }
    }
  });

  ws.send('Привіт! Ти підключений до локального WS сервера 🚀');
});

// запускаємо сервер
server.listen(PORT, () => {
  console.log(`WebSocket сервер запущено на ws://localhost:${PORT}`);
});
