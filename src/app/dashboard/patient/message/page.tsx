"use client";
import React from 'react';
import Sidebar from '../sidebar/sidebar'; // Ensure the import path is correct

const MessagePage = () => {
  return (
    <div className="bg-white min-h-screen flex font-sans">
      <Sidebar /> {/* Use the Sidebar component here */}
      <div className="p-8 flex-1">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Messages</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Your messages will be displayed here.</p>
        </div>
      </div>
    </div>
  );
};

export default MessagePage;