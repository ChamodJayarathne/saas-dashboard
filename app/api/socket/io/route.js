


// import { Server as SocketIOServer } from 'socket.io';
// import { NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth';
// import { options } from '../../auth/[...nextauth]/options';

// let io;

// export async function GET(req) {
//   try {
//     // Check authentication first
//     const session = await getServerSession(options);
//     if (!session) {
//       return new NextResponse('Unauthorized', { status: 401 });
//     }

//     if (!io) {
//       const responseInit = {
//         headers: {
//           'content-type': 'text/plain',
//         },
//       };
//       const response = new NextResponse('Socket initialization', responseInit);

//       if (!global.io) {
//         console.log('Creating new Socket.IO server');
        
//         global.io = new SocketIOServer({
//           path: '/api/socket/io',
//           addTrailingSlash: false,
//           cors: {
//             origin: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
//             methods: ['GET', 'POST'],
//             credentials: true,
//           },
//           transports: ['polling', 'websocket'],
//         });

//         // Simplified authentication middleware
//         global.io.use(async (socket, next) => {
//           try {
//             const session = await getServerSession(options);
//             if (session) {
//               socket.user = session.user;
//               next();
//             } else {
//               next(new Error('Unauthorized'));
//             }
//           } catch (error) {
//             console.error('Socket authentication error:', error);
//             next(new Error('Authentication error'));
//           }
//         });

//         global.io.on('connection', (socket) => {
//           console.log('Socket connected:', socket.id);
          
//           socket.on('join', (userId) => {
//             if (socket.user.id === userId) {
//               socket.join(userId);
//               console.log(`User ${userId} joined their room`);
//             }
//           });
          
//           socket.on('disconnect', () => {
//             console.log('Socket disconnected:', socket.id);
//           });
//         });
//       }
      
//       io = global.io;
//     }

//     return new NextResponse('Socket.IO server is running', { status: 200 });
//   } catch (error) {
//     console.error('Socket.IO initialization error:', error);
//     return new NextResponse('Internal Server Error', { status: 500 });
//   }
// }
    // "socket.io": "^4.8.1",
    // "socket.io-client": "^4.8.1",