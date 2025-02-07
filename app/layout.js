import "./globals.css";
import Nav from "./(components)/Nav";
import LayoutClient from "./LayoutClient";
import { SidebarProvider } from "./(components)/SidebarProvider";
import AuthProvider from "./(components)/AuthProvider";

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <AuthProvider>
        <body>
          <div className="min-h-screen bg-gray-50">
            <SidebarProvider>
              <Nav />
              <LayoutClient>{children}</LayoutClient>
            </SidebarProvider>
          </div>
        </body>
      </AuthProvider>
    </html>
  );
};

export default RootLayout;
