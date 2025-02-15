import React from 'react';

const Login = () => {
  return (
    <div className="flex h-screen">
      {/* Left Side */}
      <div className="w-1/2 bg-gray-100 flex items-center justify-center">
        <div className="bg-purple-200 rounded-full p-20">
          <div className="bg-purple-500 w-20 h-20 rounded-full mx-auto"></div>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-1/2 flex flex-col items-center justify-center p-10">
        <h1 className="text-3xl font-bold mb-4">Welcome back!</h1>
        <p className="text-gray-600 mb-6">Doctor Login - Enter your credentials to access your account</p>

        <input
          type="email"
          placeholder="Email address"
          className="border border-gray-300 rounded-md p-2 mb-4 w-full"
        />
        <input
          type="password"
          placeholder="Password"
          className="border border-gray-300 rounded-md p-2 mb-4 w-full"
        />

        <div className="flex items-center mb-4 w-full">
          <input type="checkbox" className="mr-2" />
          <label>Remember for 30 days</label>
        </div>

        <button className="bg-purple-600 text-white py-2 px-4 rounded-md mb-4 w-full">Login</button>

        <div className="flex flex-col items-center w-full">
          <button className="border border-gray-300 py-2 px-4 mb-2 w-full">Sign in with Google</button>
          <button className="border border-gray-300 py-2 px-4 mb-4 w-full">Sign in with Apple</button>
          <p className="text-gray-600">
            Don't have an account?{' '}
            <span className="text-purple-600 cursor-pointer">Sign Up</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
