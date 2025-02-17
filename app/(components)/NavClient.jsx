"use client";

import React, {
  useState,
  createContext,
  useContext,
  useMemo,
  useEffect,
} from "react";
import { useSidebar } from "./SidebarProvider";
import {
  Menu,
  Bell,
  Settings,
  User,
  BarChart,
  CreditCard,
  Users,
  Home,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
// import NotificationBell from "@/components/NotificationBell";

const NavClient = ({ session }) => {
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar();
  const [notifications, setNotifications] = useState([]);
  const [ws, setWs] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const websocket = new WebSocket("ws://localhost:3001/api/ws");
    setWs(websocket);

    websocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setNotifications((prev) => [{ ...message, read: false }, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    return () => {
      websocket.close();
    };
  }, []);

  const markAsRead = () => {
    setNotifications(
      (prev) => prev.map((n) => ({ ...n, read: true })),
      setUnreadCount(0)
    );
  };

  const menuItems = useMemo(
    () => [
      { icon: Home, label: "Overview", path: "/" },
      { icon: BarChart, label: "Analytics", path: "/analytics" },
      { icon: CreditCard, label: "Billing", path: "/billing" },
    ],
    []
  );

  const menuItem = useMemo(
    () => [
      { icon: Home, label: "Overview", path: "/" },
      { icon: BarChart, label: "Analytics", path: "/analytics" },
      { icon: Users, label: "Users", path: "/users" },
      { icon: CreditCard, label: "Billing", path: "/billing" },
      { icon: Settings, label: "Settings", path: "/settings" },
    ],
    []
  );

  return (
    <div className=" bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white border-b z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-6 h-6 text-black/60" />
            </button>
            <h1 className="text-black text-xl font-semibold">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              {/* <button className="p-2 rounded-lg hover:bg-gray-100">
                <Bell className="w-6 h-6 text-black" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button> */}
              <button
                className="p-2 rounded-lg hover:bg-gray-100 relative"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (!showNotifications) markAsRead();
                }}
              >
                <Bell className="w-6 h-6 text-black" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-xl max-h-96 overflow-y-auto">
                  <div className="p-4 border-b">
                    <h3 className="text-lg font-semibold">Notifications</h3>
                  </div>
                  <div className="divide-y">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-gray-500">No notifications</p>
                    ) : (
                      notifications.map((notification, index) => (
                        <div
                          key={index}
                          className={`p-4 ${
                            !notification.read ? "bg-blue-50" : ""
                          }`}
                        >
                          <p className="text-sm font-medium">
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(notification.timestamp).toLocaleString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            {/* <NotificationBell /> */}

            {session ? (
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100">
                  {/* <User className="w-6 h-6 text-black" /> */}
                  {/* <img
                    src={session?.user?.profile?.avatar_url}
                    alt=""
                    className="h-12 w-12 rounded-full overflow-hidden"
                  /> */}
                  {session.user?.image ? (
                    <Image
                      src={session?.user?.image}
                      alt="Profile"
                      width={40}
                      height={40}
                      // loading="lazy"
                      className="h-10 w-10 rounded-full"
                      priority
                    />
                  ) : (
                    <User className="w-6 h-6 text-black" />
                  )}
                  <span className="hidden sm:inline text-black">Profile</span>
                </button>
                <Link
                  className="text-black"
                  href="/api/auth/signout?callbackUrl=/"
                >
                  Logout
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link className="text-black" href="/api/auth/signin">
                  Login
                </Link>
                <Link className="text-black" href="./RegisterUser">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar */}
      {session?.user?.role === "admin" ? (
        <>
          {" "}
          <aside
            className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r transition-all duration-300 ${
              isSidebarOpen ? "w-64" : "w-20"
            }`}
          >
            <nav className="p-4">
              <ul className="space-y-2 py-6">
                {menuItem.map((item, index) => (
                  <li key={index}>
                    <a
                      href={item.path}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <item.icon className="w-6 h-6 text-gray-600" />
                      {isSidebarOpen && (
                        <span className="text-gray-700">{item.label}</span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </>
      ) : (
        <>
          {" "}
          <aside
            className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r transition-all duration-300 ${
              isSidebarOpen ? "w-64" : "w-20"
            }`}
          >
            <nav className="p-4">
              <ul className="space-y-2 py-6">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <a
                      href={item.path}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <item.icon className="w-6 h-6 text-gray-600" />
                      {isSidebarOpen && (
                        <span className="text-gray-700">{item.label}</span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </>
      )}
      {/* <aside
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <a
                  href={item.path}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <item.icon className="w-6 h-6 text-gray-600" />
                  {isSidebarOpen && (
                    <span className="text-gray-700">{item.label}</span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside> */}
    </div>
    // </SidebarContext.Provider>
  );
};

export default NavClient;
