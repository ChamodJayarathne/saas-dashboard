// import { Server } from 'socket.io';
// import { getSession } from 'next-auth/react';

// let io;

// export function initSocket(server) {
//   if (!io) {
//     io = new Server(server, {
//       path: '/api/socketio',
//       cors: {
//         origin: process.env.NEXT_PUBLIC_BASE_URL,
//         methods: ['GET', 'POST'],
//       },
//     });

//     io.use(async (socket, next) => {
//       const session = await getSession({ req: socket.request });
//       if (session) {
//         socket.userId = session.user.id;
//         next();
//       } else {
//         next(new Error('Unauthorized'));
//       }
//     });

//     io.on('connection', (socket) => {
//       console.log(`Client connected: ${socket.userId}`);
      
//       // Join a room specific to this user
//       socket.join(`user-${socket.userId}`);

//       socket.on('disconnect', () => {
//         console.log(`Client disconnected: ${socket.userId}`);
//       });
//     });
//   }
//   return io;
// }

// export function getIO() {
//   if (!io) {
//     throw new Error('Socket.IO not initialized');
//   }
//   return io;
// }