import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/">
              <div className="flex items-center">
                <Image
                  src="/assets/logo/logo.png"
                  alt="CuraSync Logo"
                  width={40}
                  height={40}
                  className="h-10 w-auto"
                />
                <span className="ml-2 text-xl font-bold text-purple-600">CuraSync</span>
              </div>
            </Link>
          </div>
          
          <div className="flex space-x-4">
            <Link href="/about" className="text-gray-600 hover:text-purple-600 px-3 py-2">
              About
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-purple-600 px-3 py-2">
              Contact
            </Link>
            <Link href="/auth/selection" className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;