"use client";
import React from 'react';
import Link from 'next/link';

const HomePage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Link href="/auth/selection">
        <span className="text-2xl text-blue-600 hover:underline cursor-pointer">
          Sign Up
        </span>
      </Link>
    </div>
  );
};

export default HomePage;
