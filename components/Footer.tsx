
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-200 dark:bg-gray-800">
      <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          &copy; {new Date().getFullYear()} ProSınav - Komiser Yardımcılığı Hazırlık Platformu. Tüm hakları saklıdır.
        </p>
      </div>
    </footer>
  );
};

export default Footer;