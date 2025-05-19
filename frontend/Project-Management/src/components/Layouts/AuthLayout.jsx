import React from 'react';
import loginImage from '../../assets/images/Logo RHI.png';

const AuthLayout = ({ children }) => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#153542]">
      {/* Content Section */}
      <div className="w-full md:w-3/5 lg:w-[60%] flex flex-col p-4 sm:p-6 md:p-8 lg:p-12">
        <header className="mb-4 md:mb-6">
          <h2 className="text-xl font-semibold text-white transition-all">
            Project Management RHI Build
          </h2>
        </header>

        <main className="flex-grow flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto text-white">
            {children}
          </div>
        </main>

        <footer className="mt-6 text-center text-sm text-white">
          <p>© {new Date().getFullYear()} RHI Build. All rights reserved.</p>
        </footer>
      </div>

      {/* Image Section - Mengubah bg-white menjadi bg-gray-100 */}
      <div className="hidden md:flex md:w-2/5 lg:w-[40%] bg-gray-200">
        <div className="w-full h-full flex items-center justify-center p-4 md:p-6 lg:p-8">
          <div className="relative w-full max-w-md aspect-square rounded-xl overflow-hidden border border-gray-300 shadow-lg transition-all duration-300 ease-in-out transform hover:shadow-xl hover:scale-105 hover:-translate-y-1 bg-gray-100">
            <div className="absolute inset-0 bg-black opacity-5"></div>
            <img
              src={loginImage}
              alt="RHI Build"
              className="w-full h-full object-contain transition-all duration-300 hover:opacity-90 filter brightness-95"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;