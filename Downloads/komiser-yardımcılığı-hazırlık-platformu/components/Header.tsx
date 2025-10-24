
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { User } from '../types';
import { ChartBarIcon, MenuIcon, XIcon, LogoutIcon, CogIcon } from './Icons';
import ThemeToggle from './ThemeToggle';
import { useAppStore } from '../store/appStore';

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [showQuizExitConfirm, setShowQuizExitConfirm] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { quizState, resultsState, handleResultsBack } = useAppStore();

  const navItems = [
    { path: '/', label: 'Anasayfa' },
    { path: '/lessons', label: 'Dersler' },
    { path: '/questions', label: 'Sorular' },
    { path: '/exams', label: 'Denemeler' },
    { path: '/flashcards', label: 'Bilgi Kartları' },
    { path: '/admin', label: 'Admin' },
  ];
  
  const handleNavClick = (path: string) => {
    // Quiz sırasında navigation'a tıklandığında uyarı göster
    if (quizState) {
      setPendingNavigation(path);
      setShowQuizExitConfirm(true);
      return;
    }
    
    // Results ekranındayken direkt navigasyon yap ve results state'ini temizle
    if (resultsState) {
      handleResultsBack();
    }
    
    navigate(path);
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
  };

  const handleQuizExit = () => {
    // Quiz state'ini ve results state'ini temizle
    useAppStore.setState({ quizState: null, resultsState: null });
    
    if (pendingNavigation) {
      navigate(pendingNavigation);
      setPendingNavigation(null);
    }
    setShowQuizExitConfirm(false);
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
  };

  const handleQuizStay = () => {
    setShowQuizExitConfirm(false);
    setPendingNavigation(null);
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
      <header className="bg-gray-800/80 dark:bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-lg border-b dark:border-blue-100 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 text-white dark:text-gray-900 font-bold text-xl cursor-pointer transition-colors duration-300" onClick={() => handleNavClick('/')}>
                <span className="text-indigo-400 dark:text-blue-600">Pro</span>Sınav
              </div>
              <nav className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-4">
                  {navItems.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => handleNavClick(item.path)}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                        location.pathname === item.path
                          ? 'bg-indigo-600 dark:bg-blue-500 text-white dark:text-white'
                          : 'text-gray-300 dark:text-blue-600 hover:bg-gray-700 dark:hover:bg-blue-50 hover:text-white dark:hover:text-blue-700'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </nav>
            </div>
            <div className="hidden md:flex items-center">
              <ThemeToggle />
              <button
                onClick={() => handleNavClick('/stats')}
                className="ml-2 p-2 rounded-full text-gray-300 dark:text-blue-600 hover:bg-gray-700 dark:hover:bg-blue-50 hover:text-white dark:hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 dark:focus:ring-offset-white focus:ring-white dark:focus:ring-blue-500 transition-colors duration-300"
                aria-label="İstatistikler"
              >
                <ChartBarIcon className="h-6 w-6" />
              </button>
              
              <div className="ml-4 relative" ref={profileMenuRef}>
                <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex text-sm bg-gray-800 dark:bg-blue-50 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 dark:focus:ring-offset-white focus:ring-white dark:focus:ring-blue-500 transition-colors duration-300">
                  <span className="sr-only">Kullanıcı menüsünü aç</span>
                  <img className="h-8 w-8 rounded-full" src="https://picsum.photos/id/237/200/200" alt="Kullanıcı Profili" />
                </button>
                {isProfileMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1 bg-gray-800 dark:bg-white ring-1 ring-black dark:ring-blue-200 ring-opacity-5 focus:outline-none border dark:border-blue-100 transition-colors duration-300">
                     <div className="px-4 py-2 border-b border-gray-700 dark:border-blue-100">
                        <p className="text-sm text-white dark:text-gray-900 font-medium truncate">{user.name}</p>
                        <p className="text-sm text-gray-400 dark:text-blue-600 truncate">{user.email}</p>
                     </div>
                    <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('/settings'); }} className="flex items-center px-4 py-2 text-sm text-gray-300 dark:text-blue-600 hover:bg-gray-700 dark:hover:bg-blue-50 hover:text-white dark:hover:text-blue-700 w-full transition-colors duration-300">
                      <CogIcon className="h-5 w-5 mr-3" />
                      Ayarlar
                    </a>
                    <a href="#" onClick={(e) => { e.preventDefault(); onLogout(); setIsProfileMenuOpen(false); }} className="flex items-center px-4 py-2 text-sm text-gray-300 dark:text-blue-600 hover:bg-gray-700 dark:hover:bg-blue-50 hover:text-white dark:hover:text-blue-700 w-full transition-colors duration-300">
                      <LogoutIcon className="h-5 w-5 mr-3" />
                      Çıkış Yap
                    </a>
                  </div>
                )}
              </div>
            </div>
            
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-gray-300 dark:text-blue-600 hover:bg-gray-700 dark:hover:bg-blue-50 hover:text-white dark:hover:text-blue-700 transition-colors duration-300"
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
          className={`relative h-full w-64 bg-gray-800 dark:bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="text-white dark:text-gray-900 font-bold text-xl cursor-pointer transition-colors duration-300" onClick={() => handleNavClick('/')}>
                <span className="text-indigo-400 dark:text-blue-600">Pro</span>Sınav
              </div>
               <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-md text-gray-300 dark:text-blue-600 hover:bg-gray-700 dark:hover:bg-blue-50 hover:text-white dark:hover:text-blue-700 transition-colors duration-300">
                  <XIcon className="h-6 w-6" />
                </button>
            </div>
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <button key={item.path} onClick={() => handleNavClick(item.path)} className={`block px-3 py-2 rounded-md text-base text-left font-medium transition-colors duration-300 ${ location.pathname === item.path ? 'bg-indigo-600 dark:bg-blue-500 text-white dark:text-white' : 'text-gray-300 dark:text-blue-600 hover:bg-gray-700 dark:hover:bg-blue-50 hover:text-white dark:hover:text-blue-700'}`}>
                  {item.label}
                </button>
              ))}
                <div className="border-t border-gray-700 dark:border-blue-100 pt-4 mt-2 space-y-2">
                     <div className="flex items-center justify-between px-3 py-2">
                        <span className="text-gray-300 dark:text-blue-600 text-sm font-medium">Tema</span>
                        <ThemeToggle />
                     </div>
                     <button onClick={() => handleNavClick('/stats')} className={`flex items-center w-full px-3 py-2 rounded-md text-base text-left font-medium transition-colors duration-300 ${ location.pathname === '/stats' ? 'bg-indigo-600 dark:bg-blue-500 text-white dark:text-white' : 'text-gray-300 dark:text-blue-600 hover:bg-gray-700 dark:hover:bg-blue-50 hover:text-white dark:hover:text-blue-700'}`}>
                        <ChartBarIcon className="h-5 w-5 mr-3" /> İstatistikler
                    </button>
                     <button onClick={() => handleNavClick('/settings')} className={`flex items-center w-full px-3 py-2 rounded-md text-base text-left font-medium transition-colors duration-300 ${ location.pathname === '/settings' ? 'bg-indigo-600 dark:bg-blue-500 text-white dark:text-white' : 'text-gray-300 dark:text-blue-600 hover:bg-gray-700 dark:hover:bg-blue-50 hover:text-white dark:hover:text-blue-700'}`}>
                        <CogIcon className="h-5 w-5 mr-3" /> Ayarlar
                    </button>
                    <button onClick={() => { onLogout(); setIsMobileMenuOpen(false); }} className="flex items-center w-full px-3 py-2 rounded-md text-base text-left font-medium text-gray-300 dark:text-blue-600 hover:bg-gray-700 dark:hover:bg-blue-50 hover:text-white dark:hover:text-blue-700 transition-colors duration-300">
                        <LogoutIcon className="h-5 w-5 mr-3" /> Çıkış Yap
                    </button>
                </div>
            </nav>
          </div>
        </div>
      </div>
      
      {/* Quiz Exit Confirmation Modal */}
      {showQuizExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 dark:bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
            <h3 className="text-xl font-bold text-white dark:text-gray-900 mb-4">Sınavı Bitirmek İstiyor Musunuz?</h3>
            <p className="text-gray-300 dark:text-gray-600 mb-6">
              Şu anda bir sınav çözüyorsunuz. Çıkış yaparsanız sınav sonlandırılacak ve ilerlemeniz kaydedilmeyecektir.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={handleQuizExit}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Evet, Çıkış Yap
              </button>
              <button
                onClick={handleQuizStay}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Hayır, Devam Et
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;