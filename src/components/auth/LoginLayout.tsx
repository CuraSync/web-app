import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface LoginLayoutProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  userType: string;
}

const LoginLayout = ({ title, icon, children, userType }: LoginLayoutProps) => {
  const router = useRouter();

  const handleSignupClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/auth/signup/${userType}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl flex overflow-hidden">
        {/* Left Side - Decorative */}
        <div className="hidden md:flex md:w-1/2 bg-purple-600 p-12 flex-col justify-between relative">
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
              <p className="text-purple-200">
                Access your healthcare dashboard and manage your services efficiently.
              </p>
            </div>
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-center text-white text-8xl mb-8">
              {icon}
            </div>
          </div>
          {/* Decorative circles */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute w-64 h-64 rounded-full bg-purple-500 opacity-20 -top-10 -left-10"></div>
            <div className="absolute w-96 h-96 rounded-full bg-purple-500 opacity-20 -bottom-20 -right-20"></div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8">
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
                <span className="ml-2 text-xl font-bold text-purple-600">CuraSync</span>
              </div>
            </Link>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Welcome back!</h2>
              <p className="text-gray-600 mt-2">Please enter your details to sign in</p>
            </div>

            {children}

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button 
                  onClick={handleSignupClick}
                  className="text-purple-600 hover:text-purple-700 font-semibold"
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginLayout;