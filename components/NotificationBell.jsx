// 'use client';

// import React, { useState } from 'react';
// import { Bell } from 'lucide-react';
// import { useNotifications } from '@/contexts/NotificationContext';
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from '@/components/ui/popover';

// const NotificationBell = () => {
//   const { notifications, unreadCount, markAsRead, markAllAsRead, loading, error } = useNotifications();
//   const [isOpen, setIsOpen] = useState(false);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;


//   const handleMarkAsRead = async (notificationId) => {
//     await markAsRead(notificationId);
//   };

//   return (
//     <Popover open={isOpen} onOpenChange={setIsOpen}>
//       <PopoverTrigger asChild>
//         <button className="relative p-2 rounded-full hover:bg-gray-100">
//           <Bell className="h-6 w-6" />
//           {unreadCount > 0 && (
//             <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
//               {unreadCount}
//             </span>
//           )}
//         </button>
//       </PopoverTrigger>
//       <PopoverContent className="w-80 p-0">
//         <div className="flex items-center justify-between p-4 border-b">
//           <h3 className="font-semibold">Notifications</h3>
//           {unreadCount > 0 && (
//             <button
//               onClick={markAllAsRead}
//               className="text-sm text-blue-600 hover:text-blue-800"
//             >
//               Mark all as read
//             </button>
//           )}
//         </div>
//         <div className="max-h-[400px] overflow-y-auto">
//           {!notifications || notifications.length === 0 ? (
//             <div className="p-4 text-center text-gray-500">
//               No notifications
//             </div>
//           ) : (
//             notifications.map((notification) => (
//               <div
//                 key={notification._id}
//                 className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
//                   !notification.read ? 'bg-blue-50' : ''
//                 }`}
//                 onClick={() => handleMarkAsRead(notification._id)}
//               >
//                 <div className="flex items-start gap-4">
//                   <div className="flex-1">
//                     <h4 className="font-medium">{notification.title}</h4>
//                     <p className="text-sm text-gray-600">
//                       {notification.message}
//                     </p>
//                     <span className="text-xs text-gray-400">
//                       {new Date(notification.createdAt).toLocaleString()}
//                     </span>
//                   </div>
//                   <div
//                     className={`w-2 h-2 rounded-full mt-2 ${
//                       !notification.read ? 'bg-blue-600' : 'bg-gray-300'
//                     }`}
//                   />
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </PopoverContent>
//     </Popover>
//   );
// };

// export default NotificationBell;