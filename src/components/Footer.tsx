import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <Link href="/">
              <div className="flex items-center">
                <div className="relative w-10 h-10">
                  <Image
                    src="/assets/logo/logo.png"
                    alt="CuraSync Logo"
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </div>
                <span className="ml-2 text-xl font-bold text-purple-600">CuraSync</span>
              </div>
            </Link>
            <p className="mt-4 text-gray-600">
              Connecting healthcare professionals with patients for better care.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Services</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/services/doctors" className="text-gray-600 hover:text-purple-600">
                  For Doctors
                </Link>
              </li>
              <li>
                <Link href="/services/patients" className="text-gray-600 hover:text-purple-600">
                  For Patients
                </Link>
              </li>
              <li>
                <Link href="/services/labs" className="text-gray-600 hover:text-purple-600">
                  For Labs
                </Link>
              </li>
              <li>
                <Link href="/services/pharmacies" className="text-gray-600 hover:text-purple-600">
                  For Pharmacies
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-purple-600">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-purple-600">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-purple-600">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-purple-600">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Connect</h3>
            <div className="mt-4 space-y-2">
              <a href="mailto:curasync.info@gmail.com" className="block text-gray-600 hover:text-purple-600">
                curasync.info@gmail.com
              </a>
              <div className="flex space-x-6 mt-4">
                <a href="https://x.com/CuraSync_Health" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-purple-600">
                  <div className="relative w-6 h-6">
                    <Image src="/assets/icons/x.svg" alt="X (Twitter)" fill style={{ objectFit: 'contain' }} />
                  </div>
                </a>
                <a href="https://www.instagram.com/curasync" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-purple-600">
                  <div className="relative w-6 h-6">
                    <Image src="/assets/icons/ig.svg" alt="Instagram" fill style={{ objectFit: 'contain' }} />
                  </div>
                </a>
                <a href="https://www.facebook.com/curasync" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-purple-600">
                  <div className="relative w-6 h-6">
                    <Image src="/assets/icons/fb.svg" alt="Facebook" fill style={{ objectFit: 'contain' }} />
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-center text-gray-400">
            © {new Date().getFullYear()} CuraSync. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;