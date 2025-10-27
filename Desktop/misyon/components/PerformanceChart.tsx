
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Theme } from '../types';

interface PerformanceChartProps {
  data: { subject: string; score: number }[];
  theme: Theme;
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data, theme }) => {
  const isDarkMode = theme === 'dark';
  const gridColor = isDarkMode ? '#4A5568' : '#E2E8F0';
  const textColor = isDarkMode ? '#A0AEC0' : '#4A5568';
  const tooltipBg = isDarkMode ? '#2D3748' : '#FFFFFF';
  const tooltipBorder = isDarkMode ? '#4A5568' : '#CBD5E0';

  return (
    <div className="w-full h-80 bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: -10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="subject" stroke={textColor} />
          <YAxis stroke={textColor} />
          <Tooltip
            contentStyle={{
              backgroundColor: tooltipBg,
              borderColor: tooltipBorder,
              color: isDarkMode ? '#FFFFFF' : '#1A202C'
            }}
          />
          <Legend wrapperStyle={{ color: textColor }} />
          <Bar dataKey="score" fill="#667EEA" name="Başarı Puanı" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;