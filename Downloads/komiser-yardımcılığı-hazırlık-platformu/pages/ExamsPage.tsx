import React from 'react';
import { useAppStore } from '../store/appStore';
import PageHeader from '../components/PageHeader';
import { ClipboardListIcon } from '../components/Icons';
import type { MockExam, Question } from '../types';

const ExamsPage: React.FC = () => {
  const { exams, startQuiz } = useAppStore();

  return (
    <div>
      <PageHeader title="Denemeler" subtitle="Sınav provası yaparak zaman yönetiminizi geliştirin." />
      <div className="space-y-4">
        {exams.map((exam) => (
          <div key={exam.id} className="bg-gray-800 dark:bg-white p-4 rounded-lg flex items-center justify-between shadow-lg hover:bg-gray-700 dark:hover:bg-blue-50 transition-colors duration-300 border dark:border-blue-100">
            <div className="flex items-center">
              <ClipboardListIcon className="w-8 h-8 text-indigo-400 dark:text-blue-600 mr-4"/>
              <div>
                <h3 className="text-lg font-bold text-white dark:text-gray-900">{exam.name}</h3>
                <p className="text-sm text-gray-400 dark:text-blue-600">{exam.questions.length} Soru - {exam.duration} Dakika</p>
              </div>
            </div>
            <button 
              onClick={() => {
                if (exam.questions.length > 0) {
                    startQuiz(exam.questions, exam.duration, exam.name);
                } else {
                    alert("Bu denemede henüz soru bulunmuyor.");
                }
              }}
              className="bg-indigo-500 dark:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 dark:hover:bg-blue-600 transition-colors duration-300"
            >
              Denemeyi Başlat
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExamsPage;