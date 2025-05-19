import React from 'react';
import loginImage from '../../assets/images/Logo RHI.png';

const AuthLayout = ({ children }) => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      {/* Content Section */}
      <div className="w-full md:w-3/5 lg:w-[60%] flex flex-col p-4 sm:p-6 md:p-8 lg:p-12">
        <header className="mb-4 md:mb-6">
          <h2 className="text-xl font-semibold text-gray-800 transition-all">
            Project Management RHI Build
          </h2>
        </header>
        
        <main className="flex-grow flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            {children}
          </div>
        </main>
        
        <footer className="mt-6 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} RHI Build. All rights reserved.</p>
        </footer>
      </div>

      {/* Image Section */}
      <div className="hidden md:flex md:w-2/5 lg:w-[40%] bg-white">
        <div className="w-full h-full flex items-center justify-center p-4 md:p-6 lg:p-8">
          <div className="relative w-full max-w-md aspect-square rounded-xl overflow-hidden border border-gray-100 shadow-lg transition-all duration-300 ease-in-out transform hover:shadow-xl hover:scale-105 hover:-translate-y-1">
            <img
              src={loginImage}
              alt="RHI Build"
              className="w-full h-full object-contain transition-all duration-300 hover:opacity-90"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;