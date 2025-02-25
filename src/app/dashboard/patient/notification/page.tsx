"use client";
import React from 'react';

const NotificationPage = () => {
  const notifications = [
    {
      id: 1,
      title: "Appointment Reminder",
      message: "You have an appointment with Dr. James Bond tomorrow at 10:00 AM",
      time: "1 hour ago",
      isRead: false
    },
    {
      id: 2,
      title: "Lab Results Available",
      message: "Your recent blood test results are now available",
      time: "2 hours ago",
      isRead: true
    },
    {
      id: 3,
      title: "Prescription Ready",
      message: "Your prescription is ready for pickup at MedPlus Pharmacy",
      time: "3 hours ago",
      isRead: false
    }
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Notifications</h1>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`bg-white rounded-lg shadow p-4 ${
              !notification.isRead ? 'border-l-4 border-blue-500' : ''
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                <p className="text-gray-600 mt-1">{notification.message}</p>
              </div>
              <span className="text-sm text-gray-500">{notification.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPage;