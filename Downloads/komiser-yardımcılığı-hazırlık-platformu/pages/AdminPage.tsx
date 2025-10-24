import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import PageHeader from '../components/PageHeader';
import type { Subject, QuizTest, Question, MockExam, Flashcard, FlashcardsBySubject, Topic } from '../types';
import { SUBJECTS } from '../constants'; // For icons map
import { ChevronDownIcon } from '../components/Icons';

const AdminPage: React.FC = () => {
  const { 
    user,
    subjects, 
    setSubjects, 
    questionsBySubject, 
    setQuestionsBySubject, 
    exams, 
    setExams,
    flashcardsBySubject, 
    setFlashcardsBySubject 
  } = useAppStore();
  const [activeTab, setActiveTab] = useState<'subjects' | 'questions' | 'exams' | 'flashcards'>('subjects');
  const [isDirty, setIsDirty] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  
  // Accordion states
  const [openSubjectId, setOpenSubjectId] = useState<string | null>(null);
  const [openExamId, setOpenExamId] = useState<string | number | null>(null);


  useEffect(() => {
    if (activeTab === 'questions' && subjects.length > 0 && !selectedSubjectIdForQuestions) {
        setSelectedSubjectIdForQuestions(subjects[0].id);
    }
  }, [activeTab, subjects]);


  const handleSetSubjects = (value: React.SetStateAction<Subject[]>) => {
    setSubjects(value);
    setIsDirty(true);
  };
  const handleSetQuestionsBySubject = (value: React.SetStateAction<Record<string, QuizTest[]>>) => {
    setQuestionsBySubject(value);
    setIsDirty(true);
  };
  const handleSetExams = (value: React.SetStateAction<MockExam[]>) => {
    setExams(value);
    setIsDirty(true);
  };
  const handleSetFlashcardsBySubject = (value: React.SetStateAction<FlashcardsBySubject>) => {
    setFlashcardsBySubject(value);
    setIsDirty(true);
  };

  const handleSaveChanges = () => {
    try {
        localStorage.setItem('proSınav_subjects', JSON.stringify(subjects));
        localStorage.setItem('proSınav_questions', JSON.stringify(questionsBySubject));
        localStorage.setItem('proSınav_exams', JSON.stringify(exams));
        localStorage.setItem('proSınav_flashcards', JSON.stringify(flashcardsBySubject));
        setIsDirty(false);
        setShowSaveSuccess(true);
        setTimeout(() => setShowSaveSuccess(false), 3000);
    } catch (error) {
        console.error("Değişiklikler kaydedilemedi:", error);
        alert("Bir hata oluştu, değişiklikler kaydedilemedi.");
    }
  };

  // Subject & Topic Management
  const handleAddSubject = () => {
    const newSubject: Subject = {
      id: `new-subject-${Date.now()}`,
      name: 'Yeni Ders Adı',
      description: 'Yeni ders açıklaması.',
      icon: SUBJECTS[0].icon, // Default icon
      topics: [],
    };
    handleSetSubjects([...subjects, newSubject]);
  };
  const handleUpdateSubject = (id: string, field: 'name' | 'description', value: string) => {
    handleSetSubjects(subjects.map(s => s.id === id ? { ...s, [field]: value } : s));
  };
  const handleDeleteSubject = (id: string) => {
    if (window.confirm('Bu dersi silmek istediğinizden emin misiniz? Derse ait tüm konular, testler, sorular ve bilgi kartları da silinecektir.')) {
        handleSetSubjects(subjects.filter(s => s.id !== id));
        const newQuestionsBySubject = { ...questionsBySubject };
        delete newQuestionsBySubject[id];
        handleSetQuestionsBySubject(newQuestionsBySubject);
        const newFlashcardsBySubject = { ...flashcardsBySubject };
        delete newFlashcardsBySubject[id];
        handleSetFlashcardsBySubject(newFlashcardsBySubject);
    }
  };

  const handleAddTopic = (subjectId: string) => {
    const newTopic: Topic = {
        id: crypto.randomUUID(),
        title: 'Yeni Konu Başlığı',
        content: 'Konu özeti buraya gelecek...',
    };
    const updatedSubjects = subjects.map(s => {
        if (s.id === subjectId) {
            return { ...s, topics: [...s.topics, newTopic] };
        }
        return s;
    });
    handleSetSubjects(updatedSubjects);
  };
  
  const handleUpdateTopic = (subjectId: string, topicId: string, field: 'title' | 'content', value: string) => {
    const updatedSubjects = subjects.map(s => {
        if (s.id === subjectId) {
            const updatedTopics = s.topics.map(t => t.id === topicId ? { ...t, [field]: value } : t);
            return { ...s, topics: updatedTopics };
        }
        return s;
    });
    handleSetSubjects(updatedSubjects);
  };

  const handleDeleteTopic = (subjectId: string, topicId: string) => {
    if (window.confirm('Bu konuyu silmek istediğinizden emin misiniz?')) {
        const updatedSubjects = subjects.map(s => {
            if (s.id === subjectId) {
                const updatedTopics = s.topics.filter(t => t.id !== topicId);
                return { ...s, topics: updatedTopics };
            }
            return s;
        });
        handleSetSubjects(updatedSubjects);
    }
  };


  // Exam Management
  const handleAddExam = () => {
    const newExam: MockExam = {
      id: `new-exam-${Date.now()}`,
      name: "Yeni Deneme Sınavı",
      duration: 120,
      questions: [],
    };
    handleSetExams([...exams, newExam]);
  };
  const handleUpdateExam = (id: string | number, field: 'name' | 'duration', value: string | number) => {
    handleSetExams(exams.map(e => e.id === id ? { ...e, [field]: value } : e));
  };
  const handleDeleteExam = (id: string | number) => {
    if (window.confirm('Bu denemeyi ve içindeki tüm soruları silmek istediğinizden emin misiniz?')) {
      handleSetExams(exams.filter(e => e.id !== id));
    }
  };
  const handleAddQuestionToExam = (examId: string | number) => {
    const newQuestion: Question = {
        id: crypto.randomUUID(),
        question: 'Yeni deneme sorusu metni...',
        options: ['A', 'B', 'C', 'D'],
        answer: 'A',
        explanation: '',
    };
    const updatedExams = exams.map(exam => {
        if (exam.id === examId) {
            return { ...exam, questions: [...exam.questions, newQuestion] };
        }
        return exam;
    });
    handleSetExams(updatedExams);
  };
  const handleUpdateQuestionInExam = (examId: string | number, questionId: string, field: 'question' | 'answer' | 'option' | 'explanation', value: string, optionIndex?: number) => {
    const updatedExams = exams.map(exam => {
        if (exam.id === examId) {
            const updatedQuestions = exam.questions.map(q => {
                if (q.id === questionId) {
                     if (field === 'option' && optionIndex !== undefined) {
                        const newOptions = [...q.options];
                        newOptions[optionIndex] = value;
                        return { ...q, options: newOptions };
                    } else if (field !== 'option') {
                        return { ...q, [field]: value };
                    }
                }
                return q;
            });
            return { ...exam, questions: updatedQuestions };
        }
        return exam;
    });
    handleSetExams(updatedExams);
  };
  const handleDeleteQuestionFromExam = (examId: string | number, questionId: string) => {
    if (!window.confirm('Bu soruyu denemeden silmek istediğinizden emin misiniz?')) return;
    const updatedExams = exams.map(exam => {
        if (exam.id === examId) {
            const updatedQuestions = exam.questions.filter(q => q.id !== questionId);
            return { ...exam, questions: updatedQuestions };
        }
        return exam;
    });
    handleSetExams(updatedExams);
  };


  // Question Management
  const [selectedSubjectIdForQuestions, setSelectedSubjectIdForQuestions] = useState<string>(subjects[0]?.id || '');
  const [selectedTestId, setSelectedTestId] = useState<string>('');
  
  useEffect(() => {
    if (subjects.length > 0 && !subjects.find(s => s.id === selectedSubjectIdForQuestions)) {
      setSelectedSubjectIdForQuestions(subjects[0].id);
    }
  }, [subjects, selectedSubjectIdForQuestions]);
  
  useEffect(() => {
    const testsForSubject = questionsBySubject[selectedSubjectIdForQuestions] || [];
    if (testsForSubject.length > 0) {
      if (!testsForSubject.find(t => t.id === selectedTestId)) {
        setSelectedTestId(testsForSubject[0].id);
      }
    } else {
      setSelectedTestId('');
    }
  }, [selectedSubjectIdForQuestions, questionsBySubject, selectedTestId]);
  

  const handleAddTest = () => {
    if (!selectedSubjectIdForQuestions) return;
    const newTest: QuizTest = {
        id: `${selectedSubjectIdForQuestions}-test-${Date.now()}`,
        name: `Yeni Test ${ (questionsBySubject[selectedSubjectIdForQuestions]?.length || 0) + 1}`,
        questions: [],
    };
    const subjectTests = questionsBySubject[selectedSubjectIdForQuestions] || [];
    handleSetQuestionsBySubject({
        ...questionsBySubject,
        [selectedSubjectIdForQuestions]: [...subjectTests, newTest]
    });
  };

  const handleDeleteTest = (testId: string) => {
    if(!selectedSubjectIdForQuestions || !window.confirm('Bu testi ve içindeki tüm soruları silmek istediğinizden emin misiniz?')) return;
    const subjectTests = questionsBySubject[selectedSubjectIdForQuestions].filter(t => t.id !== testId);
    handleSetQuestionsBySubject({
        ...questionsBySubject,
        [selectedSubjectIdForQuestions]: subjectTests,
    });
  };

  const handleAddQuestion = () => {
    if(!selectedSubjectIdForQuestions || !selectedTestId) return;
    const newQuestion: Question = {
        id: crypto.randomUUID(),
        question: 'Yeni soru metni...',
        options: ['A', 'B', 'C', 'D'],
        answer: 'A',
        explanation: '',
    };
    const updatedQuestions = {...questionsBySubject};
    const test = updatedQuestions[selectedSubjectIdForQuestions].find(t => t.id === selectedTestId);
    if(test) {
        test.questions.push(newQuestion);
        handleSetQuestionsBySubject(updatedQuestions);
    }
  };

  const handleUpdateQuestion = (questionId: string, field: 'question' | 'answer' | 'option' | 'explanation', value: string, optionIndex?: number) => {
    if(!selectedSubjectIdForQuestions || !selectedTestId) return;

    const updatedQuestions = JSON.parse(JSON.stringify(questionsBySubject));
    const test = updatedQuestions[selectedSubjectIdForQuestions].find((t: QuizTest) => t.id === selectedTestId);
    const question = test?.questions.find((q: Question) => q.id === questionId);

    if (question) {
        if(field === 'option' && optionIndex !== undefined) {
            question.options[optionIndex] = value;
        } else if (field !== 'option') {
            question[field] = value;
        }
        handleSetQuestionsBySubject(updatedQuestions);
    }
  };

  const handleDeleteQuestion = (questionId: string) => {
     if(!selectedSubjectIdForQuestions || !selectedTestId || !window.confirm('Bu soruyu silmek istediğinizden emin misiniz?')) return;
     const updatedQuestions = {...questionsBySubject};
     const test = updatedQuestions[selectedSubjectIdForQuestions].find(t => t.id === selectedTestId);
     if(test) {
        test.questions = test.questions.filter(q => q.id !== questionId);
        handleSetQuestionsBySubject(updatedQuestions);
    }
  };

  // Flashcard Management
  const [selectedSubjectIdForFlashcards, setSelectedSubjectIdForFlashcards] = useState<string>(subjects[0]?.id || '');

  const handleAddFlashcard = () => {
    if (!selectedSubjectIdForFlashcards) return;
    const newFlashcard: Flashcard = {
        id: crypto.randomUUID(),
        front: 'Kartın Ön Yüzü',
        back: 'Kartın Arka Yüzü',
    };
    const subjectFlashcards = flashcardsBySubject[selectedSubjectIdForFlashcards] || [];
    handleSetFlashcardsBySubject({
        ...flashcardsBySubject,
        [selectedSubjectIdForFlashcards]: [...subjectFlashcards, newFlashcard]
    });
  };

  const handleUpdateFlashcard = (cardId: string, field: 'front' | 'back', value: string) => {
    if (!selectedSubjectIdForFlashcards) return;
    const updatedFlashcards = {...flashcardsBySubject};
    const card = updatedFlashcards[selectedSubjectIdForFlashcards].find(c => c.id === cardId);
    if (card) {
        card[field] = value;
        handleSetFlashcardsBySubject(updatedFlashcards);
    }
  };

  const handleDeleteFlashcard = (cardId: string) => {
    if (!selectedSubjectIdForFlashcards || !window.confirm('Bu bilgi kartını silmek istediğinizden emin misiniz?')) return;
    const subjectFlashcards = flashcardsBySubject[selectedSubjectIdForFlashcards].filter(c => c.id !== cardId);
    handleSetFlashcardsBySubject({
        ...flashcardsBySubject,
        [selectedSubjectIdForFlashcards]: subjectFlashcards,
    });
  };


  const renderContent = () => {
    switch (activeTab) {
      case 'subjects':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-white">Dersleri ve Konuları Yönet</h3>
                <button onClick={handleAddSubject} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors">Yeni Ders Ekle</button>
            </div>
            {subjects.map(subject => {
              const isOpen = openSubjectId === subject.id;
              return (
                <div key={subject.id} className="bg-gray-800 rounded-lg">
                  <button 
                    onClick={() => setOpenSubjectId(isOpen ? null : subject.id)}
                    className="w-full flex justify-between items-center p-4 text-left focus:outline-none"
                    aria-expanded={isOpen}
                    aria-controls={`subject-panel-${subject.id}`}
                  >
                    <h4 className="text-xl font-bold text-white">{subject.name}</h4>
                    <ChevronDownIcon className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isOpen && (
                    <div id={`subject-panel-${subject.id}`} className="px-4 pb-4 border-t border-gray-700">
                      <div className="mt-4 space-y-4">
                        <h5 className="text-md font-semibold text-gray-300">Ders Bilgileri</h5>
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                          <input type="text" value={subject.name} onChange={e => handleUpdateSubject(subject.id, 'name', e.target.value)} className="w-full md:w-1/3 bg-gray-700 text-white p-2 rounded" />
                          <input type="text" value={subject.description} onChange={e => handleUpdateSubject(subject.id, 'description', e.target.value)} className="w-full md:w-2/3 bg-gray-700 text-white p-2 rounded" />
                          <button onClick={() => handleDeleteSubject(subject.id)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors">Dersi Sil</button>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-600">
                          <h4 className="text-lg font-semibold text-white mb-2">Konular</h4>
                          <div className="space-y-3">
                              {subject.topics.map(topic => (
                                  <div key={topic.id} className="bg-gray-900/50 p-3 rounded-md space-y-2">
                                      <input type="text" value={topic.title} onChange={e => handleUpdateTopic(subject.id, topic.id, 'title', e.target.value)} className="w-full bg-gray-700 text-white p-2 rounded" placeholder="Konu Başlığı" />
                                      <textarea value={topic.content} onChange={e => handleUpdateTopic(subject.id, topic.id, 'content', e.target.value)} className="w-full bg-gray-700 text-white p-2 rounded" rows={3} placeholder="Konu Özeti"></textarea>
                                      <div className="text-right">
                                          <button onClick={() => handleDeleteTopic(subject.id, topic.id)} className="bg-red-600/50 hover:bg-red-600 text-white text-xs font-bold py-1 px-2 rounded transition-colors">Konuyu Sil</button>
                                      </div>
                                  </div>
                              ))}
                          </div>
                          <button onClick={() => handleAddTopic(subject.id)} className="mt-3 bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded transition-colors text-sm">Yeni Konu Ekle</button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        );
      case 'exams':
        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold text-white">Denemeleri ve Soruları Yönet</h3>
                    <button onClick={handleAddExam} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors">Yeni Deneme Ekle</button>
                </div>
                {exams.map(exam => {
                    const isOpen = openExamId === exam.id;
                    return (
                        <div key={exam.id} className="bg-gray-800 rounded-lg">
                            <button 
                                onClick={() => setOpenExamId(isOpen ? null : exam.id)}
                                className="w-full flex justify-between items-center p-4 text-left focus:outline-none"
                            >
                                <div>
                                    <h4 className="text-xl font-bold text-white">{exam.name}</h4>
                                    <p className="text-sm text-gray-400">{exam.questions.length} Soru</p>
                                </div>
                                <ChevronDownIcon className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isOpen && (
                                <div className="px-4 pb-4 border-t border-gray-700">
                                    <div className="mt-4 space-y-4">
                                        <h5 className="text-md font-semibold text-gray-300">Deneme Bilgileri</h5>
                                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                                            <input type="text" value={exam.name} onChange={e => handleUpdateExam(exam.id, 'name', e.target.value)} className="w-full md:w-1/2 bg-gray-700 text-white p-2 rounded" placeholder="Deneme Adı" />
                                            <input type="number" value={exam.duration} onChange={e => handleUpdateExam(exam.id, 'duration', parseInt(e.target.value))} className="w-full md:w-1/4 bg-gray-700 text-white p-2 rounded" placeholder="Süre (dk)" />
                                            <button onClick={() => handleDeleteExam(exam.id)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors">Denemeyi Sil</button>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-gray-600">
                                        <h4 className="text-lg font-semibold text-white mb-2">Deneme Soruları</h4>
                                        <div className="space-y-3">
                                            {exam.questions.map(q => (
                                                <div key={q.id} className="bg-gray-900/50 p-3 rounded-md space-y-2">
                                                    <textarea value={q.question} onChange={e => handleUpdateQuestionInExam(exam.id, q.id, 'question', e.target.value)} className="w-full bg-gray-700 text-white p-2 rounded" rows={2} placeholder="Soru metni"></textarea>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                        {q.options.map((opt, i) => (
                                                            <input key={i} type="text" value={opt} onChange={e => handleUpdateQuestionInExam(exam.id, q.id, 'option', e.target.value, i)} className="w-full bg-gray-600 text-white p-2 rounded" placeholder={`Seçenek ${i + 1}`} />
                                                        ))}
                                                    </div>
                                                    <textarea value={q.explanation || ''} onChange={e => handleUpdateQuestionInExam(exam.id, q.id, 'explanation', e.target.value)} className="w-full bg-gray-700 text-white p-2 rounded" rows={2} placeholder="Çözüm açıklaması (isteğe bağlı)"></textarea>
                                                    <div className="flex items-center gap-4">
                                                        <label className="text-gray-400 text-sm">Doğru Cevap:</label>
                                                        <select value={q.answer} onChange={e => handleUpdateQuestionInExam(exam.id, q.id, 'answer', e.target.value)} className="bg-gray-700 text-white p-2 rounded text-sm">
                                                            {q.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                                        </select>
                                                        <button onClick={() => handleDeleteQuestionFromExam(exam.id, q.id)} className="ml-auto bg-red-600/50 hover:bg-red-600 text-white text-xs font-bold py-1 px-2 rounded transition-colors">Soruyu Sil</button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <button onClick={() => handleAddQuestionToExam(exam.id)} className="mt-3 bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded transition-colors text-sm">Bu Denemeye Soru Ekle</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
      case 'questions':
        const testsForSelectedSubject = questionsBySubject[selectedSubjectIdForQuestions] || [];
        const questionsForSelectedTest = testsForSelectedSubject.find(t => t.id === selectedTestId)?.questions || [];
        return (
            <div>
                 <h3 className="text-2xl font-bold text-white mb-4">Soruları Yönet</h3>
                 <div className="flex flex-wrap gap-4 mb-4">
                    <select value={selectedSubjectIdForQuestions} onChange={e => { setSelectedSubjectIdForQuestions(e.target.value); }} className="bg-gray-700 text-white p-2 rounded">
                        {subjects.length > 0 ? (
                             subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)
                        ) : (
                            <option>Lütfen önce bir ders ekleyin</option>
                        )}
                    </select>
                    <select value={selectedTestId} onChange={e => setSelectedTestId(e.target.value)} className="bg-gray-700 text-white p-2 rounded">
                         {testsForSelectedSubject.length > 0 ? (
                            testsForSelectedSubject.map(t => <option key={t.id} value={t.id}>{t.name}</option>)
                         ) : (
                            <option>Bu derse ait test yok</option>
                         )}
                    </select>
                    <button onClick={handleAddTest} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors" disabled={!selectedSubjectIdForQuestions}>Bu Derse Test Ekle</button>
                    {selectedTestId && <button onClick={() => handleDeleteTest(selectedTestId)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors">Seçili Testi Sil</button>}
                 </div>

                <div className="space-y-4">
                    {questionsForSelectedTest.map(q => (
                        <div key={q.id} className="bg-gray-800 p-4 rounded-lg space-y-2">
                             <textarea value={q.question} onChange={e => handleUpdateQuestion(q.id, 'question', e.target.value)} className="w-full bg-gray-700 text-white p-2 rounded" rows={2}></textarea>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {q.options.map((opt, i) => (
                                    <input key={i} type="text" value={opt} onChange={e => handleUpdateQuestion(q.id, 'option', e.target.value, i)} className="w-full bg-gray-600 text-white p-2 rounded" />
                                ))}
                            </div>
                            <textarea value={q.explanation || ''} onChange={e => handleUpdateQuestion(q.id, 'explanation', e.target.value)} className="w-full bg-gray-700 text-white p-2 rounded" rows={2} placeholder="Çözüm açıklaması (isteğe bağlı)"></textarea>
                            <div className="flex items-center gap-4">
                                <label className="text-gray-400">Doğru Cevap:</label>
                                <select value={q.answer} onChange={e => handleUpdateQuestion(q.id, 'answer', e.target.value)} className="bg-gray-700 text-white p-2 rounded">
                                    {q.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                                <button onClick={() => handleDeleteQuestion(q.id)} className="ml-auto bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded transition-colors">Soruyu Sil</button>
                            </div>
                        </div>
                    ))}
                    {selectedTestId && <button onClick={handleAddQuestion} className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors">Bu Teste Soru Ekle</button>}
                </div>
            </div>
        );
      case 'flashcards':
        const flashcardsForSelectedSubject = flashcardsBySubject[selectedSubjectIdForFlashcards] || [];
        return (
            <div>
                 <h3 className="text-2xl font-bold text-white mb-4">Bilgi Kartlarını Yönet</h3>
                 <div className="flex gap-4 mb-4">
                    <select value={selectedSubjectIdForFlashcards} onChange={e => setSelectedSubjectIdForFlashcards(e.target.value)} className="bg-gray-700 text-white p-2 rounded">
                        {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                 </div>
                 <div className="space-y-4">
                    {flashcardsForSelectedSubject.map(card => (
                        <div key={card.id} className="bg-gray-800 p-4 rounded-lg space-y-2">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <textarea placeholder="Ön Yüz" value={card.front} onChange={e => handleUpdateFlashcard(card.id, 'front', e.target.value)} className="w-full bg-gray-700 text-white p-2 rounded" rows={3}></textarea>
                                <textarea placeholder="Arka Yüz" value={card.back} onChange={e => handleUpdateFlashcard(card.id, 'back', e.target.value)} className="w-full bg-gray-700 text-white p-2 rounded" rows={3}></textarea>
                           </div>
                           <div className="text-right">
                               <button onClick={() => handleDeleteFlashcard(card.id)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded transition-colors">Kartı Sil</button>
                           </div>
                        </div>
                    ))}
                    {selectedSubjectIdForFlashcards && <button onClick={handleAddFlashcard} className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors">Bu Derse Kart Ekle</button>}
                 </div>
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <PageHeader title="Admin Paneli" subtitle="Uygulama içeriğini buradan yönetin." />
      
      <div className="sticky top-16 bg-gray-900/80 backdrop-blur-md z-10 py-4 mb-4">
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">İçerik Yönetimi</h2>
            <div className="flex items-center gap-4">
                {showSaveSuccess && <span className="text-green-400 transition-opacity duration-500">Değişiklikler başarıyla kaydedildi!</span>}
                <button 
                    onClick={handleSaveChanges} 
                    disabled={!isDirty}
                    className={`bg-green-600 text-white font-bold py-2 px-6 rounded transition-all duration-300 ${!isDirty ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'}`}
                >
                    Değişiklikleri Kaydet
                </button>
            </div>
        </div>
      </div>

      <div className="flex border-b border-gray-700 mb-6 overflow-x-auto">
        <button onClick={() => setActiveTab('subjects')} className={`flex-shrink-0 py-2 px-4 text-lg ${activeTab === 'subjects' ? 'border-b-2 border-indigo-500 text-white' : 'text-gray-400'}`}>Dersler</button>
        <button onClick={() => setActiveTab('questions')} className={`flex-shrink-0 py-2 px-4 text-lg ${activeTab === 'questions' ? 'border-b-2 border-indigo-500 text-white' : 'text-gray-400'}`}>Sorular</button>
        <button onClick={() => setActiveTab('exams')} className={`flex-shrink-0 py-2 px-4 text-lg ${activeTab === 'exams' ? 'border-b-2 border-indigo-500 text-white' : 'text-gray-400'}`}>Denemeler</button>
        <button onClick={() => setActiveTab('flashcards')} className={`flex-shrink-0 py-2 px-4 text-lg ${activeTab === 'flashcards' ? 'border-b-2 border-indigo-500 text-white' : 'text-gray-400'}`}>Bilgi Kartları</button>
      </div>
      {renderContent()}
    </div>
  );
};

export default AdminPage;