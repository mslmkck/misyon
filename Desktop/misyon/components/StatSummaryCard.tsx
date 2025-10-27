
import React from 'react';

interface StatSummaryCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}

const StatSummaryCard: React.FC<StatSummaryCardProps> = ({ label, value, icon }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg flex items-center border border-gray-200 dark:border-gray-700">
      <div className="p-2 bg-indigo-500 rounded-full">
        {icon}
      </div>
      <div className="ml-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-lg font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
};

export default StatSummaryCard;