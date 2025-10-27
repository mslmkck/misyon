
import React, { useState, useEffect } from 'react';
import type { Subject, FlashcardsBySubject, Flashcard } from '../types';
import PageHeader from '../components/PageHeader';

const FlashcardComponent: React.FC<{ front: string; back: string; isFlipped: boolean; onClick: () => void }> = ({ front, back, isFlipped, onClick }) => {
  return (
    <div className="w-full h-64 perspective-1000" onClick={onClick}>
      <div
        className={`relative w-full h-full transform-style-3d transition-transform duration-500 ${isFlipped ? 'rotate-y-180' : ''}`}
      >
        {/* Front */}
        <div className="absolute w-full h-full backface-hidden bg-indigo-600 rounded-lg flex items-center justify-center p-6 text-center shadow-xl border border-indigo-700">
          <p className="text-2xl font-semibold text-white">{front}</p>
        </div>
        {/* Back */}
        <div className="absolute w-full h-full backface-hidden bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center p-6 text-center transform rotate-y-180 shadow-xl border border-gray-300 dark:border-gray-600">
          <p className="text-lg text-gray-900 dark:text-white">{back}</p>
        </div>
      </div>
    </div>
  );
};

interface FlashcardsPageProps {
  navigateBack: () => void;
}

const FlashcardsPage: React.FC<FlashcardsPageProps> = ({ navigateBack }) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [flashcardsBySubject, setFlashcardsBySubject] = useState<FlashcardsBySubject>({});
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = () => {
    try {
      setLoading(true);
      
      // localStorage'dan subjects'leri çek
      const storedSubjects = localStorage.getItem('proSınav_subjects');
      if (storedSubjects) {
        const parsedSubjects: Subject[] = JSON.parse(storedSubjects);
        setSubjects(parsedSubjects);
      } else {
        setSubjects([]);
      }
      
      // localStorage'dan flashcard'ları çek
      const storedFlashcards = localStorage.getItem('proSınav_flashcards');
      if (storedFlashcards) {
        const parsedFlashcards: FlashcardsBySubject = JSON.parse(storedFlashcards);
        setFlashcardsBySubject(parsedFlashcards);
      } else {
        setFlashcardsBySubject({});
      }
    } catch (error) {
      console.error('Flashcard verileri yüklenirken hata:', error);
      setSubjects([]);
      setFlashcardsBySubject({});
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectSelect = (subject: Subject) => {
    setSelectedSubject(subject);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleBack = () => {
    if (selectedSubject) {
        setSelectedSubject(null);
    } else {
        navigateBack();
    }
  };

  const handleNext = () => {
    const cards = flashcardsBySubject[selectedSubject!.id] || [];
    setIsFlipped(false);
    setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 250); // wait for card to flip back
  };
  
  const handlePrev = () => {
    const cards = flashcardsBySubject[selectedSubject!.id] || [];
    setIsFlipped(false);
     setTimeout(() => {
        setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
     }, 250);
  };

  if (loading) {
    return (
      <div>
        <PageHeader title="Bilgi Kartları" subtitle="Çalışmak istediğiniz dersi seçin." onBack={navigateBack} />
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (!selectedSubject) {
    return (
        <div>
            <PageHeader title="Bilgi Kartları" subtitle="Çalışmak istediğiniz dersi seçin." onBack={handleBack} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjects.map((subject) => (
                    <div key={subject.id} onClick={() => handleSubjectSelect(subject)} className="bg-white dark:bg-gray-800 rounded-lg p-6 flex flex-col items-start hover:bg-indigo-600 group transition-colors duration-300 shadow-md border border-gray-200 dark:border-gray-700 cursor-pointer">
                        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full group-hover:bg-white">
                            <div className="w-6 h-6 bg-indigo-500 dark:bg-indigo-400 group-hover:bg-gray-800 rounded"></div>
                        </div>
                        <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white group-hover:text-white">{subject.name}</h3>
                        <p className="mt-2 text-gray-600 dark:text-gray-400 flex-grow group-hover:text-indigo-100">{flashcardsBySubject[subject.id]?.length || 0} kart</p>
                    </div>
                ))}
                {subjects.length === 0 && (
                  <div className="col-span-full text-center text-gray-500 dark:text-gray-400">
                    <p>Henüz ders eklenmemiş.</p>
                  </div>
                )}
            </div>
        </div>
    );
  }
  
  const cardsForSubject = flashcardsBySubject[selectedSubject.id] || [];
  const card = cardsForSubject[currentIndex];

  if (cardsForSubject.length === 0) {
    return (
        <div>
            <PageHeader title={selectedSubject.name} subtitle="Bu derse ait bilgi kartı bulunamadı." onBack={handleBack} />
            <div className="text-center text-gray-500 dark:text-gray-400">
                <p>Bu ders için henüz bilgi kartı eklenmemiş. Lütfen daha sonra tekrar kontrol edin.</p>
            </div>
        </div>
    )
  }

  return (
    <div>
      <PageHeader title={selectedSubject.name} subtitle="Önemli konuları hızlı ve etkili bir şekilde tekrar edin." onBack={handleBack} />
      <div className="max-w-2xl mx-auto">
        <FlashcardComponent front={card.front} back={card.back} isFlipped={isFlipped} onClick={() => setIsFlipped(!isFlipped)} />
        <div className="mt-6 text-center text-gray-500 dark:text-gray-400">
            Kart {currentIndex + 1} / {cardsForSubject.length}
        </div>
        <div className="mt-4 flex justify-center space-x-4">
          <button onClick={handlePrev} className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300">
            Önceki
          </button>
          <button onClick={handleNext} className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors duration-300">
            Sonraki
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardsPage;