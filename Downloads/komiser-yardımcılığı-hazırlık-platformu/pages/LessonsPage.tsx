import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import PageHeader from '../components/PageHeader';
import type { Subject, Topic } from '../types';

const LessonsPage: React.FC = () => {
  const navigate = useNavigate();
  const { subjects } = useAppStore();
  const [view, setView] = useState<'subjects' | 'topics' | 'topicDetail'>('subjects');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  const handleSubjectSelect = (subject: Subject) => {
    setSelectedSubject(subject);
    setView('topics');
  };

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic);
    setView('topicDetail');
  };

  const handleBack = () => {
    if (view === 'topicDetail') {
      setView('topics');
      setSelectedTopic(null);
    } else if (view === 'topics') {
      setView('subjects');
      setSelectedSubject(null);
    } else {
      navigate('/');
    }
  };

  if (view === 'topicDetail' && selectedTopic && selectedSubject) {
    return (
      <div>
        <PageHeader title={selectedTopic.title} subtitle={`Ders: ${selectedSubject.name}`} onBack={handleBack} />
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-w-4xl mx-auto">
          <div className="prose-custom max-w-none">
            <p>{selectedTopic.content}</p>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'topics' && selectedSubject) {
    return (
      <div>
        <PageHeader title={selectedSubject.name} subtitle="Çalışmak istediğiniz konuyu seçin." onBack={handleBack} />
        <div className="space-y-4">
          {selectedSubject.topics.length > 0 ? (
            selectedSubject.topics.map((topic) => (
              <div key={topic.id} onClick={() => handleTopicSelect(topic)} className="bg-white dark:bg-gray-800 p-4 rounded-lg flex items-center justify-between shadow-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-300 cursor-pointer border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{topic.title}</h3>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <div className="mb-6">
                <svg className="w-24 h-24 mx-auto text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-300 mb-4">
                Bu derste henüz konu bulunmuyor
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                Yönetici panelinden bu derse konular ekleyebilirsiniz.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Dersler" subtitle="Çalışmak istediğiniz dersi seçerek başlayın." />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <div key={subject.id} onClick={() => handleSubjectSelect(subject)} className="bg-white dark:bg-gray-800 rounded-lg p-6 flex flex-col items-start hover:bg-blue-50 dark:hover:bg-indigo-600 group transition-colors duration-300 shadow-lg cursor-pointer border border-gray-200 dark:border-gray-700">
            <div className="bg-blue-50 dark:bg-gray-700 p-3 rounded-full group-hover:bg-blue-100 dark:group-hover:bg-white transition-colors duration-300">
              <subject.icon className="w-6 h-6 text-blue-600 dark:text-indigo-400 group-hover:text-blue-700 dark:group-hover:text-gray-800 transition-colors duration-300" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">{subject.name}</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400 flex-grow group-hover:text-gray-700 dark:group-hover:text-indigo-100 transition-colors duration-300">{subject.topics.length} konu</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LessonsPage;