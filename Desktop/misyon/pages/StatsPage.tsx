
import React from 'react';
import PageHeader from '../components/PageHeader';
import PerformanceChart from '../components/PerformanceChart';
import { USER_STATS_DATA } from '../constants';
import { ChartBarIcon, ClipboardListIcon, QuestionMarkCircleIcon } from '../components/Icons';
import type { Theme } from '../types';

interface StatsPageProps {
  navigateBack: () => void;
  theme: Theme;
}

const StatsPage: React.FC<StatsPageProps> = ({ navigateBack, theme }) => {
  const { overallProgress, lastExamScore, questionsAnswered, correctAnswers, subjectPerformance } = USER_STATS_DATA;
  const accuracy = questionsAnswered > 0 ? ((correctAnswers / questionsAnswered) * 100).toFixed(1) : 0;

  return (
    <div>
      <PageHeader title="İstatistiklerim" subtitle="Gelişiminizi takip edin ve güçlü/zayıf yönlerinizi keşfedin." onBack={navigateBack} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <ChartBarIcon className="w-8 h-8 text-indigo-500 dark:text-indigo-400 mr-4"/>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Genel İlerleme</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{overallProgress}%</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <ClipboardListIcon className="w-8 h-8 text-green-500 mr-4"/>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Son Deneme Puanı</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{lastExamScore ?? 'N/A'}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <QuestionMarkCircleIcon className="w-8 h-8 text-blue-500 mr-4"/>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Çözülen Soru</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{questionsAnswered}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <QuestionMarkCircleIcon className="w-8 h-8 text-yellow-500 mr-4"/>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Doğruluk Oranı</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{accuracy}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-transparent p-0 rounded-lg">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Ders Bazında Performans Analizi</h3>
        <PerformanceChart data={subjectPerformance} theme={theme} />
      </div>
    </div>
  );
};

export default StatsPage;