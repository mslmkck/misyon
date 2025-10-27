import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import type { Subject, Topic } from '../types';

interface LessonsPageProps {
  navigateBack: () => void;
}

const LessonsPage: React.FC<LessonsPageProps> = ({ navigateBack }) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSubjects = () => {
      try {
        setLoading(true);
        // localStorage'dan verileri çek
        const storedSubjects = localStorage.getItem('proSınav_subjects');
        
        if (storedSubjects) {
          const parsedSubjects: Subject[] = JSON.parse(storedSubjects);
          setSubjects(parsedSubjects);
        } else {
          setSubjects([]);
        }
      } catch (error) {
        console.error('Dersler yüklenirken hata:', error);
        setSubjects([]);
      } finally {
        setLoading(false);
      }
    };

    loadSubjects();
  }, []);

  const handleSubjectSelect = (subject: Subject) => {
    try {
      setLoading(true);
      // Subject'in kendi topics'ini kullan
      const subjectTopics = subject.topics || [];
      
      setTopics(subjectTopics);
      setSelectedSubject(subject);
    } catch (error) {
      console.error('Konular yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic);
  };

  const handleBack = () => {
    if (selectedTopic) {
      setSelectedTopic(null);
    } else if (selectedSubject) {
      setSelectedSubject(null);
      setTopics([]);
    } else {
      navigateBack();
    }
  };

  if (loading) {
    return (
      <div>
        <PageHeader title="Dersler" subtitle="Yükleniyor..." onBack={navigateBack} />
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-gray-300 dark:bg-gray-600 rounded-lg h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (selectedTopic && selectedSubject) {
    return (
      <div>
        <PageHeader title={selectedTopic.title} subtitle={selectedSubject.name} onBack={handleBack} />
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="prose dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: selectedTopic.content }} />
          </div>
        </div>
      </div>
    );
  }

  if (selectedSubject) {
    return (
      <div>
        <PageHeader title={selectedSubject.name} subtitle="Çalışmak istediğiniz konuyu seçin." onBack={handleBack} />
        <div className="space-y-4">
          {topics.length > 0 ? (
            topics.map((topic) => (
              <div key={topic.id} onClick={() => handleTopicSelect(topic)} className="bg-white dark:bg-gray-800 p-4 rounded-lg flex items-center justify-between shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-colors duration-300 cursor-pointer">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{topic.title}</h3>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">Bu ders için henüz konu eklenmemiş.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Dersler" subtitle="Çalışmak istediğiniz dersi seçerek başlayın." onBack={navigateBack} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <div key={subject.id} onClick={() => handleSubjectSelect(subject)} className="bg-white dark:bg-gray-800 rounded-lg p-6 flex flex-col items-start hover:bg-indigo-600 group transition-colors duration-300 shadow-md border border-gray-200 dark:border-gray-700 cursor-pointer">
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full group-hover:bg-white transition-colors duration-300">
              {subject.icon ? (
                <subject.icon className="w-6 h-6 text-indigo-500 dark:text-indigo-400 group-hover:text-gray-800" />
              ) : (
                <div className="w-6 h-6 bg-indigo-500 rounded"></div>
              )}
            </div>
            <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white group-hover:text-white">{subject.name}</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400 flex-grow group-hover:text-indigo-100">{subject.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LessonsPage;