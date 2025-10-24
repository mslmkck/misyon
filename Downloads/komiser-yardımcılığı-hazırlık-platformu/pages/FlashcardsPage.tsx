
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import type { Subject, FlashcardsBySubject } from '../types';
import PageHeader from '../components/PageHeader';

const Flashcard: React.FC<{ front: string; back: string; isFlipped: boolean; onClick: () => void }> = ({ front, back, isFlipped, onClick }) => {
  return (
    <div className="w-full h-64 perspective-1000" onClick={onClick}>
      <div
        className={`relative w-full h-full transform-style-3d transition-transform duration-500 ${isFlipped ? 'rotate-y-180' : ''}`}
      >
        {/* Front */}
        <div className="absolute w-full h-full backface-hidden bg-indigo-600 dark:bg-blue-500 rounded-lg flex items-center justify-center p-6 text-center shadow-xl transition-colors duration-300">
          <p className="text-2xl font-semibold text-white">{front}</p>
        </div>
        {/* Back */}
        <div className="absolute w-full h-full backface-hidden bg-gray-700 dark:bg-blue-600 rounded-lg flex items-center justify-center p-6 text-center transform rotate-y-180 shadow-xl transition-colors duration-300">
          <p className="text-lg text-white">{back}</p>
        </div>
      </div>
    </div>
  );
};


const FlashcardsPage: React.FC = () => {
  const navigate = useNavigate();
  const { subjects, flashcardsBySubject } = useAppStore();
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleSubjectSelect = (subject: Subject) => {
    setSelectedSubject(subject);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleBack = () => {
    if (selectedSubject) {
        setSelectedSubject(null);
    } else {
        navigate('/');
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

  if (!selectedSubject) {
    return (
        <div>
            <PageHeader title="Bilgi Kartları" subtitle="Çalışmak istediğiniz dersi seçin." onBack={handleBack} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjects.map((subject) => (
                    <div key={subject.id} onClick={() => handleSubjectSelect(subject)} className="bg-gray-800 dark:bg-white rounded-lg p-6 flex flex-col items-start hover:bg-indigo-600 dark:hover:bg-blue-500 group transition-colors duration-300 shadow-lg cursor-pointer border dark:border-blue-100">
                        <div className="bg-gray-700 dark:bg-blue-50 p-3 rounded-full group-hover:bg-white transition-colors duration-300">
                            <subject.icon className="w-6 h-6 text-indigo-400 dark:text-blue-600 group-hover:text-gray-800 transition-colors duration-300" />
                        </div>
                        <h3 className="mt-4 text-xl font-bold text-white dark:text-gray-900 group-hover:text-white transition-colors duration-300">{subject.name}</h3>
                        <p className="mt-2 text-gray-400 dark:text-blue-600 flex-grow group-hover:text-indigo-100 dark:group-hover:text-blue-100 transition-colors duration-300">{flashcardsBySubject[subject.id]?.length || 0} kart</p>
                    </div>
                ))}
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
            <div className="text-center text-gray-400 dark:text-blue-600 transition-colors duration-300">
                <p>Bu ders için henüz bilgi kartı eklenmemiş. Lütfen daha sonra tekrar kontrol edin.</p>
            </div>
        </div>
    )
  }

  return (
    <div>
      <PageHeader title={selectedSubject.name} subtitle="Önemli konuları hızlı ve etkili bir şekilde tekrar edin." onBack={handleBack} />
      <div className="max-w-2xl mx-auto">
        <Flashcard front={card.front} back={card.back} isFlipped={isFlipped} onClick={() => setIsFlipped(!isFlipped)} />
        <div className="mt-6 text-center text-gray-400 dark:text-blue-600 transition-colors duration-300">
            Kart {currentIndex + 1} / {cardsForSubject.length}
        </div>
        <div className="mt-4 flex justify-center space-x-4">
          <button onClick={handlePrev} className="bg-gray-700 dark:bg-blue-100 text-white dark:text-blue-700 font-bold py-2 px-6 rounded-lg hover:bg-gray-600 dark:hover:bg-blue-200 transition-colors duration-300">
            Önceki
          </button>
          <button onClick={handleNext} className="bg-indigo-500 dark:bg-blue-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 dark:hover:bg-blue-600 transition-colors duration-300">
            Sonraki
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardsPage;