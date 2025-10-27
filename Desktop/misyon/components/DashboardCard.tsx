
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
      className="bg-white dark:bg-gray-800 rounded-lg p-6 flex flex-col items-start cursor-pointer group hover:bg-indigo-600 transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-2xl hover:shadow-indigo-500/30 border border-gray-200 dark:border-gray-700"
    >
      <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full group-hover:bg-white transition-colors duration-300">
        {icon}
      </div>
      <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white group-hover:text-white">{title}</h3>
      <p className="mt-2 text-gray-600 dark:text-gray-400 group-hover:text-indigo-100 transition-colors duration-300">{description}</p>
    </div>
  );
};

export default DashboardCard;