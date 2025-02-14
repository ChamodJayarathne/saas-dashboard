 


// "use client";

// import React, { createContext, useContext, useEffect, useState } from "react";
// import io from "socket.io-client";
// import { useSession } from "next-auth/react";

// const NotificationContext = createContext();

// export function NotificationProvider({ children }) {
//   const [socket, setSocket] = useState(null);
//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const { data: session, status } = useSession();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);


//   const fetchNotifications = async () => {
//     if (status !== "authenticated" || !session) {
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const response = await fetch("/api/notifications", {
//         method: 'GET',
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
      
//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData.error || `Failed to fetch notifications: ${response.status}`);
//       }
      
//       const data = await response.json();
//       if (data.notifications) {
//         setNotifications(data.notifications);
//         setUnreadCount(data.notifications.filter((n) => !n.read).length);
//       }
//     } catch (error) {
//       console.error("Error fetching notifications:", error);
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
    
//     if (status === "authenticated" && session?.user) {
//       const initSocket = async () => {
//         try {
//           // Socket initialization code remains the same...
//           const response = await fetch("/api/socket/io");
//           if (!response.ok) {
//             throw new Error(`Socket initialization failed: ${response.status}`);
//           }

//           const socketInstance = io({
//             path: "/api/socket/io",
//             addTrailingSlash: false,
//             withCredentials: true,
//             reconnection: true,
//             reconnectionAttempts: 5,
//             reconnectionDelay: 1000,
//           });

//           socketInstance.on("connect", () => {
//             console.log("Connected to Socket.IO:", socketInstance.id);
//             socketInstance.emit("join", session.user.id);
//           });

//           socketInstance.on("notification", (notification) => {
//             setNotifications((prev) => [notification, ...prev]);
//             setUnreadCount((prev) => prev + 1);
//           });

//           socketInstance.on("connect_error", (err) => {
//             console.error("Socket connection error:", err);
//             setError("Failed to connect to notification service");
//           });

//           socketInstance.on("reconnect", () => {
//             console.log("Reconnected to notification service");
//             fetchNotifications();
//           });

//           setSocket(socketInstance);
//         } catch (error) {
//           console.error("Socket initialization error:", error);
//           setError("Failed to initialize notification service");
//         }
//       };

//       initSocket();
//       fetchNotifications();

//       return () => {
//         if (socket) {
//           socket.off("connect");
//           socket.off("notification");
//           socket.off("connect_error");
//           socket.off("reconnect");
//           socket.disconnect();
//         }
//       };
//     }
//     console.log('Auth status:', status);
//     console.log('Session:', session);
//   }, [session, status]);



//   const markAsRead = async (notificationId) => {
//     if (!session) return;

//     try {
//       const response = await fetch(`/api/notifications/${notificationId}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ read: true }),
//         credentials: "include",
//       });

//       if (!response.ok) {
//         throw new Error(
//           `Failed to mark notification as read: ${response.status}`
//         );
//       }

//       const { notification } = await response.json();

//       setNotifications((prev) =>
//         prev.map((n) => (n._id === notificationId ? notification : n))
//       );
//       setUnreadCount((prev) => Math.max(0, prev - 1));
//     } catch (error) {
//       console.error("Error marking notification as read:", error);
//       setError("Failed to mark notification as read");
//     }
//   };

//   const markAllAsRead = async () => {
//     if (!session) return;

//     try {
//       const response = await fetch("/api/notifications/mark-all-read", {
//         method: "PATCH",
//         credentials: "include",
//       });

//       if (!response.ok) {
//         throw new Error(
//           `Failed to mark all notifications as read: ${response.status}`
//         );
//       }

//       setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
//       setUnreadCount(0);
//     } catch (error) {
//       console.error("Error marking all notifications as read:", error);
//       setError("Failed to mark all notifications as read");
//     }
//   };

//   return (
//     <NotificationContext.Provider
//       value={{
//         notifications,
//         unreadCount,
//         markAsRead,
//         markAllAsRead,
//         fetchNotifications,
//         loading,
//         error,
//       }}
//     >
//       {children}
//     </NotificationContext.Provider>
//   );
// }

// export const useNotifications = () => useContext(NotificationContext);

