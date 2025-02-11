
export const PATCH = withRouteAuth(async (req, context, session) => {
    try {
      await connectDB();
  
      await Notification.updateMany(
        { userId: session.user.id, read: false },
        { read: true }
      );
  
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return NextResponse.json(
        { error: 'Failed to mark all notifications as read' },
        { status: 500 }
      );
    }
  });