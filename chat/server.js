// server.js
const express = require('express');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const dotenv = require('dotenv')

dotenv.config()

const PORT = process.env.PORT || 4000;

let clients = [];

// WebSocket server
wss.on('connection', ws => {
  console.log('New client connected');
  clients.push(ws);

  ws.on('message', message => {
    console.log(`Received message: ${message}`);
    // Broadcast message to all connected clients
    clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    clients = clients.filter(client => client !== ws);
  });
});

app.use(express.static('public'));

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
