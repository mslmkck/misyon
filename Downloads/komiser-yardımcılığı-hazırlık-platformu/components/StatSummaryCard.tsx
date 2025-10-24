
import React from 'react';

interface StatSummaryCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}

const StatSummaryCard: React.FC<StatSummaryCardProps> = ({ label, value, icon }) => {
  return (
    <div className="bg-gray-800 dark:bg-white p-3 sm:p-4 rounded-lg flex items-center transition-colors duration-300 border border-transparent dark:border-blue-100 shadow-sm dark:shadow-md hover:shadow-lg dark:hover:shadow-blue-100">
      <div className="p-2 bg-indigo-500 dark:bg-blue-500 rounded-full transition-colors duration-300">
        {icon}
      </div>
      <div className="ml-3 sm:ml-4">
        <p className="text-xs sm:text-sm text-gray-400 dark:text-blue-600 transition-colors duration-300">{label}</p>
        <p className="text-base sm:text-lg font-bold text-white dark:text-gray-900 transition-colors duration-300">{value}</p>
      </div>
    </div>
  );
};

export default StatSummaryCard;
