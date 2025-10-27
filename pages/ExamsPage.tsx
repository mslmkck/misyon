import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { ClipboardListIcon } from '../components/Icons';
import type { MockExam, Question } from '../types';

interface ExamsPageProps {
  navigateBack: () => void;
  startQuiz: (questions: Question[], timeLimit: number | null, name: string, source: 'questions' | 'exams') => void;
  exams?: MockExam[];
}

const ExamsPage: React.FC<ExamsPageProps> = ({ navigateBack, startQuiz, exams = [] }) => {
  const [loading, setLoading] = useState(false);

  if (loading) {
    return (
      <div>
        <PageHeader title="Denemeler" subtitle="Sınav provası yaparak zaman yönetiminizi geliştirin." onBack={navigateBack} />
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Denemeler" subtitle="Sınav provası yaparak zaman yönetiminizi geliştirin." onBack={navigateBack} />
      <div className="space-y-4">
        {exams.map((exam) => (
          <div key={exam.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg flex items-center justify-between shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <ClipboardListIcon className="w-8 h-8 text-indigo-500 dark:text-indigo-400 mr-4"/>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{exam.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{exam.questions.length} Soru - {exam.duration} Dakika</p>
                {exam.description && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{exam.description}</p>
                )}
              </div>
            </div>
            <button 
              onClick={() => {
                if (exam.questions.length > 0) {
                    startQuiz(exam.questions, exam.duration, exam.name, 'exams');
                } else {
                    alert("Bu denemede henüz soru bulunmuyor.");
                }
              }}
              className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
            >
              Denemeyi Başlat
            </button>
          </div>
        ))}
        {exams.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400">Henüz deneme eklenmemiş.</p>
        )}
      </div>
    </div>
  );
};

export default ExamsPage;