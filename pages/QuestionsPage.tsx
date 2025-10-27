import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import type { Subject, QuizTest, Question } from '../types';

interface QuestionsPageProps {
  navigateBack: () => void;
  startQuiz: (questions: Question[], timeLimit: number | null, name: string, source: 'questions' | 'exams') => void;
  subjects?: Subject[];
  questionsBySubject?: Record<string, QuizTest[]>;
}

const QuestionsPage: React.FC<QuestionsPageProps> = ({ 
  navigateBack, 
  startQuiz, 
  subjects = [], 
  questionsBySubject = {} 
}) => {
    const [view, setView] = useState<'subjects' | 'tests'>('subjects');
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [quizTests, setQuizTests] = useState<QuizTest[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSubjectSelect = (subject: Subject) => {
        setSelectedSubject(subject);
        const subjectTests = questionsBySubject[subject.id] || [];
        setQuizTests(subjectTests);
        setView('tests');
    };

    const handleTestSelect = (test: QuizTest) => {
        if (test.questions.length > 0) {
            startQuiz(test.questions, test.timeLimit, `${selectedSubject?.name} - ${test.name}`, 'questions');
        } else {
            alert("Bu testte henüz soru bulunmuyor.");
        }
    };

    const handleBack = () => {
        if (view === 'tests') {
            setView('subjects');
            setSelectedSubject(null);
            setQuizTests([]);
        } else {
            navigateBack();
        }
    };

    const pageTitle = selectedSubject ? `${selectedSubject.name} Testleri` : 'Soru Çözümü';
    const pageSubtitle = selectedSubject ? 'Çözmek istediğiniz testi seçin.' : 'Bilgilerinizi test etmek için bir ders seçin.';

    if (loading) {
        return (
            <div>
                <PageHeader title="Soru Çözümü" subtitle="Yükleniyor..." onBack={navigateBack} />
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
    
    return (
        <div>
            <PageHeader title={pageTitle} subtitle={pageSubtitle} onBack={handleBack} />

            {view === 'subjects' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subjects.map((subject) => (
                        <div key={subject.id} onClick={() => handleSubjectSelect(subject)} className="bg-white dark:bg-gray-800 rounded-lg p-6 flex flex-col items-start hover:bg-indigo-600 group transition-colors duration-300 shadow-md border border-gray-200 dark:border-gray-700 cursor-pointer">
                            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full group-hover:bg-white">
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
                    {subjects.length === 0 && (
                        <div className="col-span-full text-center py-8">
                            <p className="text-gray-500 dark:text-gray-400">Henüz ders eklenmemiş.</p>
                        </div>
                    )}
                </div>
            )}

            {view === 'tests' && selectedSubject && (
                <div className="space-y-4">
                    {quizTests.map((test) => (
                        <div key={test.id} onClick={() => handleTestSelect(test)} className="bg-white dark:bg-gray-800 p-4 rounded-lg flex items-center justify-between shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300 cursor-pointer border border-gray-200 dark:border-gray-700">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{test.name}</h3>
                                {test.description && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{test.description}</p>
                                )}
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500 dark:text-gray-400">{test.questions.length} Soru</p>
                                {test.timeLimit && (
                                    <p className="text-xs text-gray-400 dark:text-gray-500">{test.timeLimit} dakika</p>
                                )}
                            </div>
                        </div>
                    ))}
                    {quizTests.length === 0 && (
                        <p className="text-center text-gray-500 dark:text-gray-400">Bu ders için henüz test eklenmemiş.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default QuestionsPage;