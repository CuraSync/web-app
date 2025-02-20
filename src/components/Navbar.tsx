import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/">
              <div className="flex items-center">
                <div className="relative w-10 h-10">
                  <Image
                    src="/assets/logo/logo.png"
                    alt="CuraSync Logo"
                    fill
                    style={{ objectFit: 'contain' }}
                    priority
                  />
                </div>
                <span className="ml-2 text-xl font-bold text-purple-600">CuraSync</span>
              </div>
            </Link>
          </div>
          
          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-600 hover:text-purple-600 px-3 py-2 text-sm font-medium">
              Home
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-purple-600 px-3 py-2 text-sm font-medium">
              About Us
            </Link>
            <Link href="/services" className="text-gray-600 hover:text-purple-600 px-3 py-2 text-sm font-medium">
              Our Services
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-purple-600 px-3 py-2 text-sm font-medium">
              Contact
            </Link>
          </div>
          
          {/* Login Button */}
          <div className="flex items-center space-x-4">
            <Link href="/auth/selection" className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 text-sm font-medium transition-colors duration-200">
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;