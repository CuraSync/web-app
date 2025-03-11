"use client";
import React, { useState } from 'react';
import { Bell, Calendar, MessageSquare, Package, Check, X, Clock, AlertTriangle, UserPlus } from 'lucide-react';
import Sidebar from '../sidebar/sidebar';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: string;
  isRead: boolean;
  priority?: string;
}

interface DoctorRequest {
  id: number;
  doctorName: string;
  specialty: string;
  hospital: string;
  timestamp: string;
  status: string;
}

const NotificationPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'doctor' | 'lab' | 'pharmacy'>('doctor');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Lab Results Ready",
      message: "Your blood test results are now available",
      time: "Just now",
      type: "lab",
      isRead: false,
      priority: "high"
    },
    {
      id: 2,
      title: "Prescription Ready",
      message: "Your prescription is ready for pickup at MedPlus Pharmacy",
      time: "30 minutes ago",
      type: "pharmacy",
      isRead: false,
      priority: "medium"
    },
    {
      id: 3,
      title: "Appointment Reminder",
      message: "Upcoming appointment with Dr. James Martin tomorrow at 2 PM",
      time: "2 hours ago",
      type: "doctor",
      isRead: false
    }
  ]);

  // Doctor connection requests
  const [doctorRequests, setDoctorRequests] = useState<DoctorRequest[]>([
    {
      id: 1,
      doctorName: "Dr. James Martin",
      specialty: "General Surgeon",
      hospital: "Central Hospital",
      timestamp: "Feb 15, 11:30 AM",
      status: "pending"
    },
    {
      id: 2,
      doctorName: "Dr. Emily Parker",
      specialty: "Cardiologist",
      hospital: "Heart Institute",
      timestamp: "Feb 14, 03:15 PM",
      status: "pending"
    }
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'doctor':
        return <UserPlus className="w-6 h-6 text-blue-500" />;
      case 'lab':
        return <AlertTriangle className="w-6 h-6 text-purple-500" />;
      case 'pharmacy':
        return <Package className="w-6 h-6 text-green-500" />;
      default:
        return <Bell className="w-6 h-6 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: string, priority?: string) => {
    if (priority === 'high') return 'border-red-500 bg-red-50';
    if (priority === 'medium') return 'border-yellow-500 bg-yellow-50';
    
    switch (type) {
      case 'doctor':
        return 'border-blue-500 bg-blue-50';
      case 'lab':
        return 'border-purple-500 bg-purple-50';
      case 'pharmacy':
        return 'border-green-500 bg-green-50';
      default:
        return 'border-gray-500 bg-gray-50';
    }
  };

  const handleAcceptDoctor = (requestId: number) => {
    // Update the request status
    const updatedRequests = doctorRequests.map(request => 
      request.id === requestId 
        ? { ...request, status: 'accepted' } 
        : request
    );
    setDoctorRequests(updatedRequests);
    
    // Find the doctor
    const doctor = doctorRequests.find(req => req.id === requestId);
    
    if (!doctor) return;
    
    // Add a notification about the acceptance
    setNotifications([
      {
        id: Date.now(),
        title: "Doctor Connection Accepted",
        message: `You've accepted ${doctor.doctorName}'s connection request`,
        time: "Just now",
        type: "doctor",
        isRead: false
      },
      ...notifications
    ]);
    
    toast.success(`You've accepted ${doctor.doctorName}'s connection request`);
  };

  const handleRejectDoctor = (requestId: number) => {
    // Update the request status
    const updatedRequests = doctorRequests.map(request => 
      request.id === requestId 
        ? { ...request, status: 'rejected' } 
        : request
    );
    setDoctorRequests(updatedRequests);
    
    // Find the doctor
    const doctor = doctorRequests.find(req => req.id === requestId);
    
    if (!doctor) return;
    
    toast.info(`You've declined ${doctor.doctorName}'s connection request`);
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      isRead: true
    }));
    setNotifications(updatedNotifications);
    toast.success("All notifications marked as read");
  };

  const clearAll = () => {
    setNotifications([]);
    toast.success("All notifications cleared");
  };

  return (
    <div className="min-h-screen flex bg-white">
      <Sidebar />
      <div className="p-8 flex-1">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <div className="flex items-center space-x-4">
              <button 
                onClick={markAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Mark all as read
              </button>
              <button 
                onClick={clearAll}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Clear all
              </button>
            </div>
          </div>

          {/* Notification Type Tabs */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('doctor')}
              className={`px-4 py-2 rounded-lg flex items-center ${
                activeTab === 'doctor' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Doctor Requests
            </button>
            <button
              onClick={() => setActiveTab('lab')}
              className={`px-4 py-2 rounded-lg flex items-center ${
                activeTab === 'lab' 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Lab Notifications
            </button>
            <button
              onClick={() => setActiveTab('pharmacy')}
              className={`px-4 py-2 rounded-lg flex items-center ${
                activeTab === 'pharmacy' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Package className="w-4 h-4 mr-2" />
              Pharmacy Notifications
            </button>
          </div>

          {/* Doctor Requests */}
          {activeTab === 'doctor' && doctorRequests.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Doctor Connection Requests</h2>
              <div className="space-y-4">
                {doctorRequests.map((request) => (
                  <div 
                    key={request.id} 
                    className={`p-4 rounded-lg border-l-4 border-blue-500 bg-blue-50 ${
                      request.status === 'accepted' ? 'opacity-70' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <UserPlus className="w-6 h-6 text-blue-500" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">{request.doctorName} wants to connect with you</p>
                          <p className="mt-1 text-sm text-gray-600">{request.specialty} at {request.hospital}</p>
                          <div className="flex items-center mt-1">
                            <Clock className="w-4 h-4 text-gray-400 mr-1" />
                            <p className="text-xs text-gray-500">{request.timestamp}</p>
                          </div>
                          
                          {request.status === 'accepted' && (
                            <span className="mt-2 inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              Accepted
                            </span>
                          )}
                          
                          {request.status === 'rejected' && (
                            <span className="mt-2 inline-block px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                              Declined
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {request.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleAcceptDoctor(request.id)}
                            className="p-2 bg-green-100 rounded-full text-green-600 hover:bg-green-200"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleRejectDoctor(request.id)}
                            className="p-2 bg-red-100 rounded-full text-red-600 hover:bg-red-200"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Filtered Notifications */}
          <div className="space-y-4">
            {notifications
              .filter(notification => notification.type === activeTab)
              .sort((a, b) => {
                // Sort by time (most recent first)
                if (a.time.includes('now')) return -1;
                if (b.time.includes('now')) return 1;
                if (a.time.includes('minutes')) return -1;
                if (b.time.includes('minutes')) return 1;
                return 0;
              })
              .map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border-l-4 ${getNotificationColor(notification.type, notification.priority)} ${
                    !notification.isRead ? 'bg-yellow-50' : ''
                  }`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                        <span className="text-xs text-gray-500">{notification.time}</span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                    </div>
                  </div>
                </div>
              ))}

            {notifications.filter(notification => notification.type === activeTab).length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <Bell className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg">No notifications</p>
                <p className="text-sm">You're all caught up!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;