"use client";
import React, { useState } from 'react';
import { Bell, Calendar, FlaskRound as Flask, Presentation as PrescriptionBottle, UserPlus, Check, X } from 'lucide-react';
import Sidebar from '../sidebar/sidebar';
import { toast } from 'sonner';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: string;
  isRead: boolean;
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
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "New Lab Results Available",
      message: "Your recent blood test results have been uploaded",
      time: "Just now",
      type: "lab",
      isRead: false
    },
    {
      id: 2,
      title: "Appointment Reminder",
      message: "You have an appointment with Dr. James Bond tomorrow at 10:00 AM",
      time: "30 minutes ago",
      type: "appointment",
      isRead: false
    },
    {
      id: 3,
      title: "Prescription Ready",
      message: "Your prescription is ready for pickup at MedPlus Pharmacy",
      time: "2 hours ago",
      type: "pharmacy",
      isRead: false
    },
    {
      id: 4,
      title: "Lab Results Available",
      message: "Your recent blood test results are now available",
      time: "1 day ago",
      type: "lab",
      isRead: true
    },
    {
      id: 5,
      title: "Appointment Completed",
      message: "Your appointment with Dr. Sarah Jhons has been completed",
      time: "2 days ago",
      type: "appointment",
      isRead: true
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
      case 'appointment':
        return <Calendar className="w-6 h-6 text-blue-500" />;
      case 'lab':
        return <Flask className="w-6 h-6 text-purple-500" />;
      case 'pharmacy':
        return <PrescriptionBottle className="w-6 h-6 text-green-500" />;
      case 'doctor':
        return <UserPlus className="w-6 h-6 text-blue-500" />;
      default:
        return <Bell className="w-6 h-6 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'appointment':
        return 'border-blue-500 bg-blue-50';
      case 'lab':
        return 'border-purple-500 bg-purple-50';
      case 'pharmacy':
        return 'border-green-500 bg-green-50';
      case 'doctor':
        return 'border-blue-500 bg-blue-50';
      default:
        return 'border-gray-500 bg-gray-50';
    }
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      isRead: true
    }));
    setNotifications(updatedNotifications);
  };

  const clearAll = () => {
    setNotifications([]);
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

  return (
    <div className="bg-white min-h-screen flex font-sans">
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

          {/* Doctor Connection Requests */}
          {doctorRequests.length > 0 && (
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
                          <p className="text-xs text-gray-500 mt-1">{request.timestamp}</p>
                          
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

          {notifications.length === 0 ? (
            <div className="text-center text-gray-500">
              <p className="text-lg">You don't have any notifications.</p>
              <p className="text-sm">Enjoy your day!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Today's Notifications */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Today</h2>
                {notifications
                  .filter(notification => 
                    notification.time.includes('now') || 
                    notification.time.includes('minutes') || 
                    notification.time.includes('hours')
                  )
                  .map((notification) => (
                    <div
                      key={notification.id}
                      className={`mb-4 p-4 rounded-lg border-l-4 ${getNotificationColor(notification.type)} ${
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
              </div>

              {/* Earlier Notifications */}
              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Earlier</h2>
                {notifications
                  .filter(notification => 
                    notification.time.includes('day')
                  )
                  .map((notification) => (
                    <div
                      key={notification.id}
                      className={`mb-4 p-4 rounded-lg border-l-4 ${getNotificationColor(notification.type)} opacity-75 ${
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
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;