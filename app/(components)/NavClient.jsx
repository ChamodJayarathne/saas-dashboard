"use client";

import React, { useState, createContext, useContext } from "react";
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
import NotificationBell from "@/components/NotificationBell";

const NavClient = ({ session }) => {

  const { isSidebarOpen, setIsSidebarOpen } = useSidebar();
  const [notifications, setNotifications] = useState([]);

  const menuItems = [
    { icon: Home, label: "Overview", path: "/" },
    { icon: BarChart, label: "Analytics", path: "/analytics" },
    { icon: CreditCard, label: "Billing", path: "/billing" },
  
  ];

  const menuItem = [
    { icon: Home, label: "Overview", path: "/" },
    { icon: BarChart, label: "Analytics", path: "/analytics" },
    { icon: Users, label: "Users", path: "/users" },
    { icon: CreditCard, label: "Billing", path: "/billing" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

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
            {/* <div className="relative">
              <button className="p-2 rounded-lg hover:bg-gray-100">
                <Bell className="w-6 h-6 text-black" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>
            </div> */}
             <NotificationBell />

            {session ? (
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100">
                  {/* <User className="w-6 h-6 text-black" /> */}
                  <img
                    src={session?.user?.profile?.avatar_url}
                    alt=""
                    className="h-12 w-12 rounded-full overflow-hidden"
                  />
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
