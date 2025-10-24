
import React from 'react';
import { useAppStore } from '../store/appStore';
import PageHeader from '../components/PageHeader';
import StatSummaryCard from '../components/StatSummaryCard';
import PerformanceChart from '../components/PerformanceChart';
import { USER_STATS_DATA } from '../constants';
import { ChartBarIcon, ClipboardListIcon, QuestionMarkCircleIcon } from '../components/Icons';
import type { User } from '../types';

const StatsPage: React.FC = () => {
  const { user } = useAppStore();
  const { overallProgress, lastExamScore, questionsAnswered, correctAnswers, subjectPerformance } = USER_STATS_DATA;
  const accuracy = questionsAnswered > 0 ? ((correctAnswers / questionsAnswered) * 100).toFixed(1) : 0;

  return (
    <div>
      <PageHeader title="İstatistiklerim" subtitle="Gelişiminizi takip edin ve güçlü/zayıf yönlerinizi keşfedin." />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <ChartBarIcon className="w-8 h-8 text-indigo-400 mr-4"/>
            <div>
              <p className="text-sm text-gray-400">Genel İlerleme</p>
              <p className="text-3xl font-bold text-white">{overallProgress}%</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <ClipboardListIcon className="w-8 h-8 text-green-400 mr-4"/>
            <div>
              <p className="text-sm text-gray-400">Son Deneme Puanı</p>
              <p className="text-3xl font-bold text-white">{lastExamScore ?? 'N/A'}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <QuestionMarkCircleIcon className="w-8 h-8 text-blue-400 mr-4"/>
            <div>
              <p className="text-sm text-gray-400">Çözülen Soru</p>
              <p className="text-3xl font-bold text-white">{questionsAnswered}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <QuestionMarkCircleIcon className="w-8 h-8 text-yellow-400 mr-4"/>
            <div>
              <p className="text-sm text-gray-400">Doğruluk Oranı</p>
              <p className="text-3xl font-bold text-white">{accuracy}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
        <h3 className="text-2xl font-bold text-white mb-4">Ders Bazında Performans Analizi</h3>
        <PerformanceChart data={subjectPerformance} />
      </div>
    </div>
  );
};

export default StatsPage;
