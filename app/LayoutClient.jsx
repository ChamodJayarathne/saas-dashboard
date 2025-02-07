

'use client';

import { useSidebar } from './(components)/SidebarProvider';

const LayoutClient = ({ children }) => {
  const { isSidebarOpen } = useSidebar();

  return (
    <main
      className={`pt-16 transition-all duration-300 ${
        isSidebarOpen ? "ml-64" : "ml-20"
      }`}
    >
      <div className="p-6">{children}</div>
    </main>
  );
};

export default LayoutClient;