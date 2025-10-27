import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import type { Subject, QuizTest, Question, MockExam, Flashcard, FlashcardsBySubject, Topic } from '../types';
import { SUBJECTS } from '../constants'; // For icons map
import { ChevronDownIcon } from '../components/Icons';
import { dbHelpers } from "../src/lib/supabase";

interface AdminPageProps {
  navigateBack: () => void;
  subjects: Subject[];
  setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>;
  questionsBySubject: Record<string, QuizTest[]>;
  setQuestionsBySubject: React.Dispatch<React.SetStateAction<Record<string, QuizTest[]>>>;
  exams: MockExam[];
  setExams: React.Dispatch<React.SetStateAction<MockExam[]>>;
  flashcardsBySubject: FlashcardsBySubject;
  setFlashcardsBySubject: React.Dispatch<React.SetStateAction<FlashcardsBySubject>>;
}

const AdminPage: React.FC<AdminPageProps> = ({ 
    navigateBack, 
    subjects, setSubjects, 
    questionsBySubject, setQuestionsBySubject, 
    exams, setExams,
    flashcardsBySubject, setFlashcardsBySubject
}) => {
  const [activeTab, setActiveTab] = useState<'subjects' | 'questions' | 'exams' | 'flashcards' | 'announcements'>('subjects');
  const [isDirty, setIsDirty] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  
  // Accordion states
  const [openSubjectId, setOpenSubjectId] = useState<string | null>(null);
  const [openExamId, setOpenExamId] = useState<string | number | null>(null);

  // Question Management states
  const [selectedSubjectIdForQuestions, setSelectedSubjectIdForQuestions] = useState<string>(subjects[0]?.id || '');
  const [selectedTestId, setSelectedTestId] = useState<string>('');

  // Flashcard Management states
  const [selectedSubjectIdForFlashcards, setSelectedSubjectIdForFlashcards] = useState<string>(subjects[0]?.id || '');

  // Announcement Management states
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', is_active: true });

  useEffect(() => {
    if (activeTab === 'questions' && subjects.length > 0 && !selectedSubjectIdForQuestions) {
        setSelectedSubjectIdForQuestions(subjects[0].id);
    }
  }, [activeTab, subjects, selectedSubjectIdForQuestions]);

  useEffect(() => {
    if (subjects.length > 0 && !subjects.find(s => s.id === selectedSubjectIdForQuestions)) {
      setSelectedSubjectIdForQuestions(subjects[0].id);
    }
  }, [subjects, selectedSubjectIdForQuestions]);
  
  // Load announcements when tab changes to announcements
  useEffect(() => {
    if (activeTab === 'announcements') {
      loadAnnouncements();
    }
  }, [activeTab]);
  
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

  // Announcement Management
  const loadAnnouncements = async () => {
    try {
      const data = await dbHelpers.getAllAnnouncements();
      setAnnouncements(data || []);
    } catch (error) {
      console.error('Duyurular yüklenirken hata:', error);
    }
  };

  const handleCreateAnnouncement = async () => {
    if (!newAnnouncement.title.trim() || !newAnnouncement.content.trim()) {
      alert('Başlık ve içerik alanları boş olamaz!');
      return;
    }
    
    try {
      await dbHelpers.createAnnouncement({
        title: newAnnouncement.title,
        content: newAnnouncement.content,
        is_active: newAnnouncement.is_active
      });
      setNewAnnouncement({ title: '', content: '', is_active: true });
      loadAnnouncements();
    } catch (error) {
      console.error('Duyuru oluşturulurken hata:', error);
      alert('Duyuru oluşturulamadı!');
    }
  };

  const handleUpdateAnnouncement = async (id: string, field: 'title' | 'content' | 'is_active', value: string | boolean) => {
    try {
      const announcement = announcements.find(a => a.id === id);
      if (announcement) {
        const updatedData = { ...announcement, [field]: value };
        await dbHelpers.updateAnnouncement(id, {
          title: updatedData.title,
          content: updatedData.content,
          is_active: updatedData.is_active
        });
        loadAnnouncements();
      }
    } catch (error) {
      console.error('Duyuru güncellenirken hata:', error);
      alert('Duyuru güncellenemedi!');
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (window.confirm('Bu duyuruyu silmek istediğinizden emin misiniz?')) {
      try {
        await dbHelpers.deleteAnnouncement(id);
        loadAnnouncements();
      } catch (error) {
        console.error('Duyuru silinirken hata:', error);
        alert('Duyuru silinemedi!');
      }
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

  // Question Management
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

  // Flashcard Management
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
    const inputClasses = "w-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none";
    const textareaClasses = `${inputClasses} resize-y`;

    switch (activeTab) {
      case 'subjects':
        return (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Dersleri ve Konuları Yönet</h3>
                <button onClick={handleAddSubject} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors text-sm">Yeni Ders Ekle</button>
            </div>
            {subjects.map(subject => {
              const isOpen = openSubjectId === subject.id;
              return (
                <div key={subject.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <button 
                    onClick={() => setOpenSubjectId(isOpen ? null : subject.id)}
                    className="w-full flex justify-between items-center p-3 sm:p-4 text-left focus:outline-none"
                    aria-expanded={isOpen}
                    aria-controls={`subject-panel-${subject.id}`}
                  >
                    <h4 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white pr-2">{subject.name}</h4>
                    <ChevronDownIcon className={`w-5 h-5 sm:w-6 sm:h-6 text-gray-500 dark:text-gray-400 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isOpen && (
                    <div id={`subject-panel-${subject.id}`} className="px-3 sm:px-4 pb-3 sm:pb-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="mt-4 space-y-4">
                        <h5 className="text-sm sm:text-md font-semibold text-gray-600 dark:text-gray-300">Ders Bilgileri</h5>
                        <div className="space-y-3 sm:space-y-0 sm:flex sm:flex-row sm:items-center sm:gap-4">
                          <input type="text" value={subject.name} onChange={e => handleUpdateSubject(subject.id, 'name', e.target.value)} className={`${inputClasses} text-sm sm:text-base sm:w-1/3`} placeholder="Ders Adı" />
                          <input type="text" value={subject.description} onChange={e => handleUpdateSubject(subject.id, 'description', e.target.value)} className={`${inputClasses} text-sm sm:text-base sm:w-2/3`} placeholder="Ders Açıklaması" />
                          <button onClick={() => handleDeleteSubject(subject.id)} className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors text-sm">Dersi Sil</button>
                        </div>
                      </div>
 
                      <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
                          <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">Konular</h4>
                          <div className="space-y-3">
                              {subject.topics.map(topic => (
                                  <div key={topic.id} className="bg-gray-100 dark:bg-gray-900/50 p-3 rounded-md space-y-2 border border-gray-200 dark:border-gray-700">
                                      <input type="text" value={topic.title} onChange={e => handleUpdateTopic(subject.id, topic.id, 'title', e.target.value)} className={`${inputClasses} text-sm`} placeholder="Konu Başlığı" />
                                      <textarea value={topic.content} onChange={e => handleUpdateTopic(subject.id, topic.id, 'content', e.target.value)} className={`${textareaClasses} text-sm`} rows={3} placeholder="Konu Özeti"></textarea>
                                      <div className="text-right">
                                          <button onClick={() => handleDeleteTopic(subject.id, topic.id)} className="bg-red-700/50 hover:bg-red-700 text-white text-xs font-bold py-1 px-2 rounded transition-colors">Konuyu Sil</button>
                                      </div>
                                  </div>
                              ))}
                          </div>
                          <button onClick={() => handleAddTopic(subject.id)} className="mt-3 w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded transition-colors text-sm">Yeni Konu Ekle</button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        );

      case 'questions':
        const testsForSelectedSubject = questionsBySubject[selectedSubjectIdForQuestions] || [];
        const selectedTest = testsForSelectedSubject.find(t => t.id === selectedTestId);
        
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Testleri ve Soruları Yönet</h3>
            
            <div className="flex flex-col md:flex-row gap-4">
              <select value={selectedSubjectIdForQuestions} onChange={e => { setSelectedSubjectIdForQuestions(e.target.value); }} className={inputClasses}>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>{subject.name}</option>
                ))}
              </select>
              
              {testsForSelectedSubject.length > 0 && (
                <select value={selectedTestId} onChange={e => setSelectedTestId(e.target.value)} className={inputClasses}>
                  <option value="">Test Seçin</option>
                  {testsForSelectedSubject.map(test => (
                    <option key={test.id} value={test.id}>{test.name} ({test.questions.length} soru)</option>
                  ))}
                </select>
              )}
            </div>
            
            <div className="flex gap-2">
              <button onClick={handleAddTest} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors" disabled={!selectedSubjectIdForQuestions}>Bu Derse Test Ekle</button>
              {selectedTestId && (
                <>
                  <button onClick={() => handleDeleteTest(selectedTestId)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors">Testi Sil</button>
                  <button onClick={handleAddQuestion} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">Soru Ekle</button>
                </>
              )}
            </div>

            {selectedTest && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 sm:p-4">
                <h4 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">{selectedTest.name}</h4>
                <div className="space-y-4">
                  {selectedTest.questions.map((question, qIndex) => (
                    <div key={question.id} className="bg-gray-100 dark:bg-gray-900/50 p-3 sm:p-4 rounded-md border border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Soru {qIndex + 1}</h5>
                        <button onClick={() => handleDeleteQuestion(question.id)} className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-1 px-2 rounded transition-colors">Sil</button>
                      </div>
                      <textarea value={question.question} onChange={e => handleUpdateQuestion(question.id, 'question', e.target.value)} className={`${textareaClasses} text-sm`} rows={3} placeholder="Soru metni"></textarea>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                        {question.options.map((option, oIndex) => (
                          <input key={oIndex} type="text" value={option} onChange={e => handleUpdateQuestion(question.id, 'option', e.target.value, oIndex)} className={`${inputClasses} text-sm`} placeholder={`Seçenek ${String.fromCharCode(65 + oIndex)}`} />
                        ))}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 mt-2">
                        <select value={question.answer} onChange={e => handleUpdateQuestion(question.id, 'answer', e.target.value)} className={`${inputClasses} text-sm sm:w-1/4`}>
                          {question.options.map((_, oIndex) => (
                            <option key={oIndex} value={String.fromCharCode(65 + oIndex)}>{String.fromCharCode(65 + oIndex)}</option>
                          ))}
                        </select>
                        <textarea value={question.explanation} onChange={e => handleUpdateQuestion(question.id, 'explanation', e.target.value)} className={`${textareaClasses} text-sm sm:flex-1`} rows={2} placeholder="Açıklama (isteğe bağlı)"></textarea>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'exams':
        return (
            <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Sınavları Yönet</h3>
                
                <div className="flex flex-col gap-3 sm:gap-4">
                    <input type="text" value={newExamName} onChange={e => setNewExamName(e.target.value)} className={`${inputClasses} text-sm sm:text-base`} placeholder="Sınav adı" />
                    <textarea value={newExamDescription} onChange={e => setNewExamDescription(e.target.value)} className={`${textareaClasses} text-sm sm:text-base`} rows={3} placeholder="Sınav açıklaması"></textarea>
                    <input type="number" value={newExamDuration} onChange={e => setNewExamDuration(Number(e.target.value))} className={`${inputClasses} text-sm sm:text-base`} placeholder="Süre (dakika)" />
                    <input type="number" value={newExamQuestionCount} onChange={e => setNewExamQuestionCount(Number(e.target.value))} className={`${inputClasses} text-sm sm:text-base`} placeholder="Soru sayısı" />
                    
                    <div className="flex flex-col sm:flex-row gap-2">
                        <button onClick={handleAddExam} className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors text-sm">Sınav Ekle</button>
                    </div>
                </div>
            
                <div className="space-y-3">
                    {exams.map(exam => (
                        <div key={exam.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 sm:p-4">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4">
                                <div className="flex-1">
                                    <h4 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{exam.name}</h4>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mt-1">{exam.description}</p>
                                    <div className="flex flex-wrap gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                        <span>Süre: {exam.duration} dk</span>
                                        <span>Soru: {exam.questionCount}</span>
                                        <span>Oluşturulma: {new Date(exam.createdAt).toLocaleDateString('tr-TR')}</span>
                                    </div>
                                </div>
                                <button onClick={() => handleDeleteExam(exam.id)} className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded transition-colors text-sm">Sil</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );

      case 'flashcards':
        return (
          <div className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Flash Kartları Yönet</h3>
            
            <div className="flex flex-col gap-3 sm:gap-4">
              <select value={selectedSubjectIdForFlashcards} onChange={e => setSelectedSubjectIdForFlashcards(e.target.value)} className={`${inputClasses} text-sm sm:text-base`}>
                <option value="">Ders Seçin</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>{subject.name}</option>
                ))}
              </select>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <button onClick={handleAddFlashcard} className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors text-sm" disabled={!selectedSubjectIdForFlashcards}>Flash Kart Ekle</button>
              </div>
            </div>
          
            <div className="space-y-3">
              {flashcards.filter(fc => fc.subjectId === selectedSubjectIdForFlashcards).map(flashcard => (
                <div key={flashcard.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 sm:p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Flash Kart</h4>
                    <button onClick={() => handleDeleteFlashcard(flashcard.id)} className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-1 px-2 rounded transition-colors">Sil</button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ön Yüz</label>
                      <textarea value={flashcard.front} onChange={e => handleUpdateFlashcard(flashcard.id, 'front', e.target.value)} className={`${textareaClasses} text-sm`} rows={2} placeholder="Ön yüz metni"></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Arka Yüz</label>
                      <textarea value={flashcard.back} onChange={e => handleUpdateFlashcard(flashcard.id, 'back', e.target.value)} className={`${textareaClasses} text-sm`} rows={2} placeholder="Arka yüz metni"></textarea>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'announcements':
        return (
          <div className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Duyuruları Yönet</h3>
            
            <div className="flex flex-col gap-3 sm:gap-4">
              <input type="text" value={newAnnouncementTitle} onChange={e => setNewAnnouncementTitle(e.target.value)} className={`${inputClasses} text-sm sm:text-base`} placeholder="Duyuru başlığı" />
              <textarea value={newAnnouncementContent} onChange={e => setNewAnnouncementContent(e.target.value)} className={`${textareaClasses} text-sm sm:text-base`} rows={4} placeholder="Duyuru içeriği"></textarea>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <button onClick={handleAddAnnouncement} className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors text-sm">Duyuru Ekle</button>
              </div>
            </div>

            <div className="space-y-3">
              {announcements.map(announcement => (
                <div key={announcement.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4">
                    <div className="flex-1">
                      <input type="text" value={announcement.title} onChange={e => handleUpdateAnnouncement(announcement.id, 'title', e.target.value)} className={`${inputClasses} text-sm sm:text-base font-semibold`} />
                      <textarea value={announcement.content} onChange={e => handleUpdateAnnouncement(announcement.id, 'content', e.target.value)} className={`${textareaClasses} text-sm sm:text-base mt-2`} rows={3}></textarea>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Oluşturulma: {new Date(announcement.createdAt).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                    <button onClick={() => handleDeleteAnnouncement(announcement.id)} className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded transition-colors text-sm">Sil</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PageHeader 
        title="Yönetici Paneli" 
        subtitle="İçerikleri düzenleyin ve yönetin"
        onBack={navigateBack}
      />
      
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Save Changes Button */}
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Mobile-optimized Tab Navigation */}
          <div className="w-full sm:w-auto">
            <div className="flex overflow-x-auto bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700 scrollbar-hide">
              {(['subjects', 'questions', 'exams', 'flashcards', 'announcements'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {tab === 'subjects' && 'Dersler'}
                  {tab === 'questions' && 'Testler'}
                  {tab === 'exams' && 'Denemeler'}
                  {tab === 'flashcards' && 'Bilgi Kartları'}
                  {tab === 'announcements' && 'Duyurular'}
                </button>
              ))}
            </div>
          </div>
          
          {/* Mobile-optimized Save Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
            {showSaveSuccess && (
              <span className="text-green-600 dark:text-green-400 text-xs sm:text-sm font-medium">
                ✓ Değişiklikler kaydedildi!
              </span>
            )}
            <button
              onClick={handleSaveChanges}
              disabled={!isDirty}
              className={`w-full sm:w-auto px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                isDirty
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
            >
              Değişiklikleri Kaydet
            </button>
          </div>
        </div>

        {/* Content */}
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminPage;