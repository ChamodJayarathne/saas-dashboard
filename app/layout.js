
import "./globals.css";
import Nav from "./(components)/Nav";
import LayoutClient from "./LayoutClient";
import { SidebarProvider } from "./(components)/SidebarProvider";
import AuthProvider from "./(components)/AuthProvider";
import { NotificationProvider } from "@/contexts/NotificationContext";

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <NotificationProvider>
            <SidebarProvider>
              <div className="min-h-screen bg-gray-50">
                <Nav />
                <LayoutClient>{children}</LayoutClient>
              </div>
            </SidebarProvider>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
