import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useAppStore } from '../store/appStore';

const Layout: React.FC = () => {
  const { user, handleLogout } = useAppStore();

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 dark:bg-gray-100 font-sans transition-colors duration-300">
      <Header user={user} onLogout={handleLogout} />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;