
import React, { useState, useRef, useEffect } from 'react';
import type { Page, User, Theme } from '../types';
import { ChartBarIcon, MenuIcon, XIcon, LogoutIcon, CogIcon, SunIcon, MoonIcon } from './Icons';
import UserAvatar from './UserAvatar';

interface HeaderProps {
  navigateTo: (page: Page) => void;
  currentPage: Page;
  onLogout: () => void;
  user: User;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const Header: React.FC<HeaderProps> = ({ navigateTo, currentPage, onLogout, user, theme, setTheme }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isAdminFromStorage, setIsAdminFromStorage] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Local storage'dan admin durumunu kontrol et
  useEffect(() => {
    const checkAdminStatus = () => {
      const savedIsAdmin = localStorage.getItem('proSınav_isAdmin');
      setIsAdminFromStorage(savedIsAdmin === 'true');
    };

    checkAdminStatus();
    
    // Storage değişikliklerini dinle (farklı sekmeler arası senkronizasyon için)
    window.addEventListener('storage', checkAdminStatus);
    
    return () => {
      window.removeEventListener('storage', checkAdminStatus);
    };
  }, []);

  // Admin durumunu hem user prop'undan hem de local storage'dan kontrol et
  const isAdmin = user.isAdmin || isAdminFromStorage;

  const navItems: { page: Page; label: string }[] = [
    { page: 'home', label: 'Anasayfa' },
    { page: 'lessons', label: 'Dersler' },
    { page: 'questions', label: 'Sorular' },
    { page: 'exams', label: 'Denemeler' },
    { page: 'flashcards', label: 'Bilgi Kartları' },
    ...(isAdmin ? [{ page: 'admin' as Page, label: 'Admin' }] : []),
  ];
  
  const handleNavClick = (page: Page) => {
    navigateTo(page);
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md sticky top-0 z-50 shadow-md dark:shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 text-gray-900 dark:text-white font-bold text-xl cursor-pointer" onClick={() => handleNavClick('home')}>
                <span className="text-indigo-600 dark:text-indigo-400">Pro</span>Sınav
              </div>
              <nav className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-4">
                  {navItems.map((item) => (
                    <button
                      key={item.page}
                      onClick={() => handleNavClick(item.page)}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                        currentPage === item.page
                          ? 'bg-indigo-600 text-white'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </nav>
            </div>
            <div className="hidden md:flex items-center">
              <button
                onClick={() => handleNavClick('stats')}
                className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-indigo-500 transition-colors duration-300"
                aria-label="İstatistikler"
              >
                <ChartBarIcon className="h-6 w-6" />
              </button>
              
              <div className="ml-4 relative" ref={profileMenuRef}>
                <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex text-sm bg-gray-200 dark:bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-indigo-500">
                  <span className="sr-only">Kullanıcı menüsünü aç</span>
                  <UserAvatar name={user.name} email={user.email} size={32} />
                </button>
                {isProfileMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none">
                     <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-900 dark:text-white font-medium truncate">{user.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                     </div>
                    <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('settings'); }} className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white w-full">
                      <CogIcon className="h-5 w-5 mr-3" />
                      Ayarlar
                    </a>
                    <button onClick={toggleTheme} className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white w-full">
                      {theme === 'light' ? <MoonIcon className="h-5 w-5 mr-3" /> : <SunIcon className="h-5 w-5 mr-3" />}
                      {theme === 'light' ? 'Koyu Tema' : 'Açık Tema'}
                    </button>
                    <button 
                      onClick={(e) => { 
                        e.preventDefault(); 
                        e.stopPropagation();
                        onLogout(); 
                        setIsProfileMenuOpen(false); 
                      }} 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white w-full text-left"
                    >
                      <LogoutIcon className="h-5 w-5 mr-3" />
                      Çıkış Yap
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
              >
                <span className="sr-only">Menüyü aç</span>
                {isMobileMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}></div>
        <div
          className={`relative h-full w-64 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="text-gray-900 dark:text-white font-bold text-xl cursor-pointer" onClick={() => handleNavClick('home')}>
                <span className="text-indigo-600 dark:text-indigo-400">Pro</span>Sınav
              </div>
               <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
                  <XIcon className="h-6 w-6" />
                </button>
            </div>
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <button key={item.page} onClick={() => handleNavClick(item.page)} className={`block px-3 py-2 rounded-md text-base text-left font-medium transition-colors duration-300 ${ currentPage === item.page ? 'bg-indigo-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'}`}>
                  {item.label}
                </button>
              ))}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-2 space-y-2">
                     <button onClick={() => handleNavClick('stats')} className={`flex items-center w-full px-3 py-2 rounded-md text-base text-left font-medium transition-colors duration-300 ${ currentPage === 'stats' ? 'bg-indigo-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'}`}>
                        <ChartBarIcon className="h-5 w-5 mr-3" /> İstatistikler
                    </button>
                     <button onClick={() => handleNavClick('settings')} className={`flex items-center w-full px-3 py-2 rounded-md text-base text-left font-medium transition-colors duration-300 ${ currentPage === 'settings' ? 'bg-indigo-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'}`}>
                        <CogIcon className="h-5 w-5 mr-3" /> Ayarlar
                    </button>
                    <button 
                      onClick={(e) => { 
                        e.preventDefault(); 
                        e.stopPropagation();
                        onLogout(); 
                        setIsMobileMenuOpen(false); 
                      }} 
                      className="flex items-center w-full px-3 py-2 rounded-md text-base text-left font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
                    >
                        <LogoutIcon className="h-5 w-5 mr-3" /> Çıkış Yap
                    </button>
                </div>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;