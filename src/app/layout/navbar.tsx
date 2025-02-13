"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '../../../public/assets/images/Logo.png';
import fb from '../../../public/assets/icons/fb.svg';
import twitter from '../../../public/assets/icons/x.svg';
import ig from '../../../public/assets/icons/ig.svg';
import {
    NavigationMenu,
    NavigationMenuLink,
    NavigationMenuList,
} from '../../app/layout/navigation-menu';

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full h-16 bg-white z-50 border-b shadow-md">
      <div className="container h-full mx-auto flex items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image src={Logo} alt="Logo" width={50} height={50} />
          <span className="font-bold text-2xl">CuraSync</span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <div>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-200 focus:bg-gray-200 focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                  Home
                </NavigationMenuLink>
              </Link>
            </div>
            <div>
              <Link href="/about" legacyBehavior passHref>
                <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-200 focus:bg-gray-200 focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                  About Us
                </NavigationMenuLink>
              </Link>
            </div>
            <div>
              <Link href="/services" legacyBehavior passHref>
                <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-200 focus:bg-gray-200 focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                  Our Services
                </NavigationMenuLink>
              </Link>
            </div>
            <div>
              <Link href="/contact" legacyBehavior passHref>
                <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-200 focus:bg-gray-200 focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                  Contact
                </NavigationMenuLink>
              </Link>
            </div>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Social Icons and User Login */}
        <div className="flex items-center space-x-4">
          <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <Image src={fb} alt="Facebook" width={24} height={24} />
          </Link>
          <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <Image src={twitter} alt="Twitter" width={24} height={24} />
          </Link>
          <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <Image src={ig} alt="Instagram" width={24} height={24} />
          </Link>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            User Login
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;