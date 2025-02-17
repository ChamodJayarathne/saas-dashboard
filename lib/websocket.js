// import { WebSocketServer } from 'ws'

// class NotificationServer {
//   constructor(server) {
//     this.wss = new WebSocketServer({ server, path: '/api/ws' })
//     this.clients = new Set()

//     this.wss.on('connection', (ws) => {
//       this.clients.add(ws)
//       console.log('New client connected')

//       ws.on('close', () => {
//         this.clients.delete(ws)
//         console.log('Client disconnected')
//       })
//     })
//   }

//   broadcast(message) {
//     const data = JSON.stringify(message)
//     for (const client of this.clients) {
//       if (client.readyState === 1) { // 1 = OPEN
//         client.send(data)
//       }
//     }
//   }
// }

// let notificationServer = null

// export function initWebSocket(server) {
//   if (!notificationServer) {
//     notificationServer = new NotificationServer(server)
//   }
//   return notificationServer
// }

// export function getNotificationServer() {
//   return notificationServer
// }



import { WebSocketServer } from 'ws';
import http from 'http';

class NotificationServer {
  constructor(server) {
    this.wss = new WebSocketServer({ server, path: '/api/ws' });
    this.clients = new Set();

    this.wss.on('connection', (ws) => {
      this.clients.add(ws);
      console.log('New client connected');

      ws.on('close', () => {
        this.clients.delete(ws);
        console.log('Client disconnected');
      });
    });
  }

  broadcast(message) {
    const data = JSON.stringify(message);
    for (const client of this.clients) {
      if (client.readyState === 1) {
        client.send(data);
      }
    }
  }
}

let notificationServer = null;

export function initWebSocket() {
  if (!notificationServer) {
    const server = http.createServer();
    notificationServer = new NotificationServer(server);

    // Find an available port
    const PORT = process.env.WS_PORT || 3001;
    server.listen(PORT, () => {
      console.log(`WebSocket server listening on port ${PORT}`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${PORT} is in use, trying another port...`);
        server.listen(0, () => {
          console.log(`WebSocket server listening on port ${server.address().port}`);
        });
      } else {
        console.error('WebSocket server error:', err);
      }
    });
  }
  return notificationServer;
}

export function getNotificationServer() {
  return notificationServer;
}
