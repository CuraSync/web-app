"use client";
import React, { useState } from 'react';
import { Bell, Calendar, FlaskRound as Flask, Presentation as PrescriptionBottle } from 'lucide-react';
import Sidebar from '../sidebar/sidebar'; // Ensure the import path is correct

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([
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

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return <Calendar className="w-6 h-6 text-blue-500" />;
      case 'lab':
        return <Flask className="w-6 h-6 text-purple-500" />;
      case 'pharmacy':
        return <PrescriptionBottle className="w-6 h-6 text-green-500" />;
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

  return (
    <div className="bg-white min-h-screen flex font-sans">
      <Sidebar /> {/* Use the Sidebar component here */}
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