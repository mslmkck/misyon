
import React from 'react';

interface DashboardCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, description, icon, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-gray-800 dark:bg-white rounded-lg p-4 sm:p-6 flex flex-col items-start cursor-pointer group hover:bg-indigo-600 dark:hover:bg-blue-500 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-2xl hover:shadow-indigo-500/30 dark:hover:shadow-blue-500/30 border border-transparent dark:border-gray-200 dark:hover:border-blue-300"
    >
      <div className="bg-gray-700 dark:bg-blue-50 p-2 sm:p-3 rounded-full group-hover:bg-white dark:group-hover:bg-white transition-colors duration-300 border dark:border-blue-100">
        {icon}
      </div>
      <h3 className="mt-3 sm:mt-4 text-lg sm:text-xl font-bold text-white dark:text-gray-900 group-hover:text-white transition-colors duration-300">{title}</h3>
      <p className="mt-2 text-sm sm:text-base text-gray-400 dark:text-blue-600 group-hover:text-indigo-100 dark:group-hover:text-blue-100 transition-colors duration-300">{description}</p>
    </div>
  );
};

export default DashboardCard;
