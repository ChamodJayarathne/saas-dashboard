

// import { getServerSession } from 'next-auth/next';
// import { NextResponse } from 'next/server';
// import { options } from '@/app/api/auth/[...nextauth]/options';

// export function withRouteAuth(handler) {
//   return async (req, context) => {
//     try {
//       const session = await getServerSession(options);

//       if (!session) {
//         return NextResponse.json(
//           { error: 'Please sign in to continue' },
//           { status: 401 }
//         );
//       }

//       // Pass the session to the handler
//       return handler(req, context, session);
//     } catch (error) {
//       console.error('Auth middleware error:', error);
//       return NextResponse.json(
//         { error: 'Authentication error' },
//         { status: 500 }
//       );
//     }
//   };
// }