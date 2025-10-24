import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import PageHeader from '../components/PageHeader';
import type { Subject, QuizTest, Question } from '../types';

const QuestionsPage: React.FC = () => {
    const navigate = useNavigate();
    const subjects = useAppStore((state) => state.subjects);
    const questionsBySubject = useAppStore((state) => state.questionsBySubject);
    const startQuiz = useAppStore((state) => state.startQuiz);
    const [view, setView] = useState<'subjects' | 'tests'>('subjects');
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

    const handleSubjectSelect = (subject: Subject) => {
        setSelectedSubject(subject);
        setView('tests');
    };

    const handleTestSelect = (test: QuizTest) => {
        if (test.questions.length > 0) {
            startQuiz(test.questions, null, `${selectedSubject?.name} - ${test.name}`);
        } else {
            alert("Bu testte henüz soru bulunmuyor.");
        }
    };

    const handleBack = () => {
        if (view === 'tests') {
            setView('subjects');
            setSelectedSubject(null);
        } else {
            navigate('/');
        }
    };
    
    const pageTitle = selectedSubject ? `${selectedSubject.name} Testleri` : 'Soru Çözümü';
    const pageSubtitle = selectedSubject ? 'Çözmek istediğiniz testi seçin.' : 'Bilgilerinizi test etmek için bir ders seçin.';
    
    return (
        <div>
            <PageHeader title={pageTitle} subtitle={pageSubtitle} onBack={handleBack} />

            {view === 'subjects' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subjects.map((subject) => (
                        <div key={subject.id} onClick={() => handleSubjectSelect(subject)} className="bg-gray-800 dark:bg-white rounded-lg p-6 flex flex-col items-start hover:bg-indigo-600 dark:hover:bg-blue-50 group transition-colors duration-300 shadow-lg cursor-pointer border dark:border-blue-100">
                            <div className="bg-gray-700 dark:bg-blue-50 p-3 rounded-full group-hover:bg-white dark:group-hover:bg-blue-100">
                                <subject.icon className="w-6 h-6 text-indigo-400 dark:text-blue-600 group-hover:text-gray-800 dark:group-hover:text-blue-700" />
                            </div>
                            <h3 className="mt-4 text-xl font-bold text-white dark:text-gray-900">{subject.name}</h3>
                            <p className="mt-2 text-gray-400 dark:text-blue-600 flex-grow">{subject.description}</p>
                        </div>
                    ))}
                </div>
            )}

            {view === 'tests' && selectedSubject && (
                <div className="space-y-4">
                    {(questionsBySubject[selectedSubject.id] || []).map((test) => (
                        <div key={test.id} onClick={() => handleTestSelect(test)} className="bg-gray-800 dark:bg-white p-4 rounded-lg flex items-center justify-between shadow-lg hover:bg-gray-700 dark:hover:bg-blue-50 transition-colors duration-300 cursor-pointer border dark:border-blue-100">
                            <h3 className="text-lg font-bold text-white dark:text-gray-900">{test.name}</h3>
                            <p className="text-sm text-gray-400 dark:text-blue-600">{test.questions.length} Soru</p>
                        </div>
                    ))}
                     {(!questionsBySubject[selectedSubject.id] || questionsBySubject[selectedSubject.id].length === 0) && (
                        <p className="text-center text-gray-400 dark:text-blue-600">Bu ders için henüz test eklenmemiş.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default QuestionsPage;