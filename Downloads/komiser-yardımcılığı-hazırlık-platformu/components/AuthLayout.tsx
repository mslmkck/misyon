
import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
       <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/az-subtle.png')", opacity: '0.1'}}></div>
       <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-900/50"></div>
       <div className="relative z-10">
            {children}
       </div>
    </div>
  );
};

export default AuthLayout;
