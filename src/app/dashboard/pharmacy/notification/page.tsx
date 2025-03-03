"use client";
import React, { useState } from 'react';
import { Bell, Calendar, MessageSquare, Package, Check, X, Clock, AlertTriangle } from 'lucide-react';
import PharmacySidebar from '../sidebar/sidebar';
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
      title: "New Prescription Order",
      message: "Dr. James Martin has sent a new prescription for Sarah Johnson",
      time: "Just now",
      type: "prescription",
      isRead: false,
      priority: "high"
    },
    {
      id: 2,
      title: "Medication Stock Alert",
      message: "Lisinopril 10mg is running low on stock (5 units remaining)",
      time: "30 minutes ago",
      type: "stock",
      isRead: false,
      priority: "medium"
    },
    {
      id: 3,
      title: "Delivery Confirmation",
      message: "Order #12345 has been successfully delivered to Michael Brown",
      time: "2 hours ago",
      type: "delivery",
      isRead: false
    },
    {
      id: 4,
      title: "New Message",
      message: "You have a new message from Dr. Emily Parker",
      time: "1 day ago",
      type: "message",
      isRead: true
    },
    {
      id: 5,
      title: "Refill Request",
      message: "John Doe has requested a refill for his prescription",
      time: "2 days ago",
      type: "prescription",
      isRead: true
    }
  ]);

  // Prescription requests
  const [prescriptionRequests, setPrescriptionRequests] = useState<PrescriptionRequest[]>([
    {
      id: 1,
      patientName: "Sarah Johnson",
      doctorName: "Dr. James Martin",
      medication: "Amoxicillin 500mg, 30 tablets",
      requestTime: "Feb 15, 11:30 AM",
      status: "pending"
    },
    {
      id: 2,
      patientName: "Michael Brown",
      doctorName: "Dr. Emily Parker",
      medication: "Lisinopril 10mg, 90 tablets",
      requestTime: "Feb 14, 03:15 PM",
      status: "pending"
    }
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'prescription':
        return <Package className="w-6 h-6 text-blue-500" />;
      case 'stock':
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
      case 'delivery':
        return <Check className="w-6 h-6 text-green-500" />;
      case 'message':
        return <MessageSquare className="w-6 h-6 text-purple-500" />;
      default:
        return <Bell className="w-6 h-6 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: string, priority?: string) => {
    if (priority === 'high') return 'border-red-500 bg-red-50';
    if (priority === 'medium') return 'border-yellow-500 bg-yellow-50';
    
    switch (type) {
      case 'prescription':
        return 'border-blue-500 bg-blue-50';
      case 'stock':
        return 'border-yellow-500 bg-yellow-50';
      case 'delivery':
        return 'border-green-500 bg-green-50';
      case 'message':
        return 'border-purple-500 bg-purple-50';
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
    toast.success("All notifications marked as read");
  };

  const clearAll = () => {
    setNotifications([]);
    toast.success("All notifications cleared");
  };

  const handleAcceptPrescription = (requestId: number) => {
    // Update the request status
    const updatedRequests = prescriptionRequests.map(request => 
      request.id === requestId 
        ? { ...request, status: 'accepted' } 
        : request
    );
    setPrescriptionRequests(updatedRequests);
    
    // Find the prescription
    const prescription = prescriptionRequests.find(req => req.id === requestId);
    
    if (!prescription) return;
    
    // Add a notification about the acceptance
    setNotifications([
      {
        id: Date.now(),
        title: "Prescription Accepted",
        message: `You've accepted the prescription for ${prescription.patientName}`,
        time: "Just now",
        type: "prescription",
        isRead: false
      },
      ...notifications
    ]);
    
    toast.success(`You've accepted the prescription for ${prescription.patientName}`);
  };

  const handleRejectPrescription = (requestId: number) => {
    // Update the request status
    const updatedRequests = prescriptionRequests.map(request => 
      request.id === requestId 
        ? { ...request, status: 'rejected' } 
        : request
    );
    setPrescriptionRequests(updatedRequests);
    
    // Find the prescription
    const prescription = prescriptionRequests.find(req => req.id === requestId);
    
    if (!prescription) return;
    
    toast.info(`You've declined the prescription for ${prescription.patientName}`);
  };

  const handleMessageClick = (notification: Notification) => {
    // Navigate to messages page
    router.push('/dashboard/pharmacy/messages');
  };

  return (
    <div className="min-h-screen flex bg-white">
      <PharmacySidebar />
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

          {/* Prescription Requests */}
          {prescriptionRequests.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Prescription Requests</h2>
              <div className="space-y-4">
                {prescriptionRequests.map((request) => (
                  <div 
                    key={request.id} 
                    className={`p-4 rounded-lg border-l-4 border-blue-500 bg-blue-50 ${
                      request.status === 'accepted' ? 'opacity-70' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <Package className="w-6 h-6 text-blue-500" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">Prescription for {request.patientName}</p>
                          <p className="mt-1 text-sm text-gray-600">From: {request.doctorName}</p>
                          <p className="mt-1 text-sm text-gray-600">Medication: {request.medication}</p>
                          <div className="flex items-center mt-1">
                            <Clock className="w-4 h-4 text-gray-400 mr-1" />
                            <p className="text-xs text-gray-500">{request.requestTime}</p>
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
                            onClick={() => handleAcceptPrescription(request.id)}
                            className="p-2 bg-green-100 rounded-full text-green-600 hover:bg-green-200"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleRejectPrescription(request.id)}
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
                      className={`mb-4 p-4 rounded-lg border-l-4 ${getNotificationColor(notification.type, notification.priority)} ${
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
                          
                          {notification.type === 'message' && (
                            <button 
                              onClick={() => handleMessageClick(notification)}
                              className="mt-2 flex items-center text-sm text-blue-600 hover:text-blue-800"
                            >
                              <MessageSquare className="w-4 h-4 mr-1" />
                              <span>View Message</span>
                            </button>
                          )}
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
                          
                          {notification.type === 'message' && (
                            <button 
                              onClick={() => handleMessageClick(notification)}
                              className="mt-2 flex items-center text-sm text-blue-600 hover:text-blue-800"
                            >
                              <MessageSquare className="w-4 h-4 mr-1" />
                              <span>View Message</span>
                            </button>
                          )}
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