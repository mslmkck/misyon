
import React from 'react';
import { ArrowLeftIcon } from './Icons';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  onBack: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, onBack }) => {
  return (
    <div className="mb-8">
      <button onClick={onBack} className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors duration-300 mb-4">
        <ArrowLeftIcon className="w-5 h-5 mr-2" />
        Geri Dön
      </button>
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">{title}</h1>
      <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">{subtitle}</p>
    </div>
  );
};

export default PageHeader;