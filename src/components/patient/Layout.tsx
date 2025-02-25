"use client";
import React from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen font-sans bg-white">
      <Sidebar />
      <div className="flex-1 bg-gray-50">
        <TopNav />
        {children}
      </div>
    </div>
  );
};

export default Layout;