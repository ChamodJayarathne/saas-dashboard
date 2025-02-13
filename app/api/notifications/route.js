// import { NextResponse } from 'next/server';
// import { connectDB } from '@/lib/mongodb';
// import Notification from '@/models/Notification';
// import { withRouteAuth } from '@/lib/withRouteAuth';

// export const GET = withRouteAuth(async (req, context, session) => {
//   try {
//     await connectDB();

//     // Remove the redundant session check
//     const notifications = await Notification.find({ userId: session.user.id })
//       .sort({ createdAt: -1 })
//       .limit(50);

//     return NextResponse.json({ notifications: notifications || [] });
//   } catch (error) {
//     console.error('Error fetching notifications:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch notifications' },
//       { status: 500 }
//     );
//   }
// });
