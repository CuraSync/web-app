"use client";
import React, { useState } from 'react';
import { Bell, MessageSquare, Package, Check, X, Clock } from 'lucide-react';
import Sidebar from '../../lab/sidebar/sidebar';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: string;
  isRead: boolean;
}

interface PrescriptionRequest {
  id: number;
  patientName: string;
  doctorName: string;
  medication: string;
  requestTime: string;
  status: string;
}

const NotificationPage = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "New Report Order",
      message: "You have a new report order from John Doe",
      time: "Just now",
      type: "report",
      isRead: false
    },
    {
      id: 2,
      title: "Delivery Confirmation",
      message: "Order #12345 has been successfully delivered to Michael Brown",
      time: "2 hours ago",
      type: "delivery",
      isRead: false
    },
    {
      id: 3,
      title: "New Message",
      message: "You have a new message from Dr. Emily Parker",
      time: "1 day ago",
      type: "message",
      isRead: true
    }
  ]);

  const [prescriptionRequests, setPrescriptionRequests] = useState<PrescriptionRequest[]>([
    {
      id: 1,
      patientName: "Sarah Johnson",
      doctorName: "Dr. James Martin",
      medication: "Amoxicillin 500mg, 30 tablets",
      requestTime: "Feb 15, 11:30 AM",
      status: "pending"
    }
  ]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    toast.success("All notifications marked as read");
  };

  const clearAll = () => {
    setNotifications([]);
    toast.success("All notifications cleared");
  };

  const handleAcceptPrescription = (id: number) => {
    setPrescriptionRequests(prev => prev.map(req => req.id === id ? { ...req, status: 'accepted' } : req));
    toast.success("Prescription accepted");
  };

  const handleRejectPrescription = (id: number) => {
    setPrescriptionRequests(prev => prev.map(req => req.id === id ? { ...req, status: 'rejected' } : req));
    toast.info("Prescription declined");
  };

  return (
    <div className="min-h-screen flex bg-white">
      <Sidebar />
      <div className="p-8 flex-1 max-w-4xl mx-auto">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">Notifications</h1>
          <div className="space-x-4">
            <button onClick={markAllAsRead} className="text-blue-600 hover:underline">Mark all as read</button>
            <button onClick={clearAll} className="text-gray-600 hover:underline">Clear all</button>
          </div>
        </div>

        {prescriptionRequests.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Prescription Requests</h2>
            {prescriptionRequests.map(req => (
              <div key={req.id} className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-md mt-2">
                <p><strong>{req.patientName}</strong> needs {req.medication} prescribed by {req.doctorName}</p>
                <small className="text-gray-500 flex items-center"><Clock className="w-4 h-4 mr-1" /> {req.requestTime}</small>
                <div className="mt-2 space-x-2">
                  <button onClick={() => handleAcceptPrescription(req.id)} className="p-2 bg-green-100 rounded text-green-600 hover:bg-green-200"><Check className="w-5 h-5" /></button>
                  <button onClick={() => handleRejectPrescription(req.id)} className="p-2 bg-red-100 rounded text-red-600 hover:bg-red-200"><X className="w-5 h-5" /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {notifications.length === 0 ? (
          <p className="text-gray-500 text-center">No new notifications</p>
        ) : (
          notifications.map(n => (
            <div key={n.id} className={`p-4 border-l-4 ${n.isRead ? 'bg-gray-100' : 'bg-yellow-50'} rounded-md mt-2`}>
              <p className="font-medium">{n.title}</p>
              <p className="text-gray-600 text-sm">{n.message}</p>
              <small className="text-gray-500">{n.time}</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPage;