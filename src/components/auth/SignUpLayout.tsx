import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PlusIcon } from 'lucide-react';

interface SignUpLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  userType: string; // Add userType prop
}

const SignUpLayout = ({ title, description, children, userType }: SignUpLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl flex overflow-hidden">
        {/* Left Side - Decorative */}
        <div className="hidden md:flex md:w-1/3 bg-blue-900 p-12 flex-col justify-between relative">
          <div className="relative z-10">
            <Link href="/">
              <div className="flex items-center">
                <div className="relative w-12 h-12">
                  <Image
                    src="/assets/logo/logo.png"
                    alt="CuraSync Logo"
                    fill
                    style={{ objectFit: 'contain' }}
                    className="invert"
                    priority
                  />
                </div>
                <span className="ml-2 text-2xl font-bold text-white">CuraSync</span>
              </div>
            </Link>
            <div className="mt-16">
              <h2 className="text-3xl font-bold text-white mb-6">{title}</h2>
              <p className="text-blue-200">
                {description}
              </p>
            </div>
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-center text-white">
              <PlusIcon className="w-32 h-32" />
            </div>
          </div>
          {/* Decorative circles */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute w-64 h-64 rounded-full bg-blue-500 opacity-20 -top-10 -left-10"></div>
            <div className="absolute w-96 h-96 rounded-full bg-blue-500 opacity-20 -bottom-20 -right-20"></div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-2/3 p-8">
          <div className="md:hidden flex items-center justify-between mb-8">
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
                <span className="ml-2 text-xl font-bold text-blue-600">CuraSync</span>
              </div>
            </Link>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Get Started Now</h2>
              <p className="text-gray-600 mt-2">Create your account and start your journey</p>
            </div>

            {children}

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href={`/auth/login/${userType}`} className="text-blue-600 hover:text-blue-700 font-semibold">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpLayout;