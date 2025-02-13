
// export const PATCH = withRouteAuth(async (req, context, session) => {
//     try {
//       await connectDB();
  
//       const { id } = context.params;
//       const { read } = await req.json();
  
//       const notification = await Notification.findOneAndUpdate(
//         { _id: id, userId: session.user.id },
//         { read },
//         { new: true }
//       );
  
//       if (!notification) {
//         return NextResponse.json(
//           { error: "Notification not found" },
//           { status: 404 }
//         );
//       }
  
//       return NextResponse.json({ notification });
//     } catch (error) {
//       console.error("Error updating notification:", error);
//       return NextResponse.json(
//         { error: "Failed to update notification" },
//         { status: 500 }
//       );
//     }
//   });
