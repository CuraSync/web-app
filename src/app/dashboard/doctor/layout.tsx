"use client";
import React from 'react';
import DoctorSidebar from '@/components/doctor/Sidebar';

export default function DoctorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <DoctorSidebar />
      <div className="flex-1 ml-64">
        {children}
      </div>
    </div>
  );
}