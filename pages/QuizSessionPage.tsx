import React, { useState, useEffect, useRef } from 'react';
import type { Question } from '../types';
import { ClockIcon } from '../components/Icons';

interface QuizSessionPageProps {
  questions: Question[];
  timeLimit: number | null; // in minutes
  quizName: string;
  onFinish: (answers: Record<string, string>) => void;
}

const QuizSessionPage: React.FC<QuizSessionPageProps> = ({ questions, timeLimit, quizName, onFinish }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(() => {
    // timeLimit'in geçerli bir sayı olduğundan emin ol
    if (timeLimit && typeof timeLimit === 'number' && timeLimit > 0) {
      return timeLimit * 60;
    }
    return null;
  });
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  // useRef to hold a stable reference to the onFinish callback and userAnswers.
  // This prevents the timer's useEffect from re-running every time the user answers a question.
  const onFinishRef = useRef(onFinish);
  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  const userAnswersRef = useRef(userAnswers);
  useEffect(() => {
    userAnswersRef.current = userAnswers;
  }, [userAnswers]);


  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  
  const handleFinish = () => {
    const answeredCount = Object.keys(userAnswersRef.current).length;
    const totalCount = questions.length;
    let confirmMessage = "Sınavı bitirmek istediğinizden emin misiniz?";
    if (answeredCount < totalCount) {
        confirmMessage += `\n\n${totalCount - answeredCount} adet cevaplanmamış soru boş olarak kabul edilecektir.`;
    }

    if (window.confirm(confirmMessage)) {
      onFinishRef.current(userAnswersRef.current);
    }
  };

  // Stable timer effect that runs only once.
  useEffect(() => {
    // timeLimit'in geçerli bir sayı olduğundan emin ol
    if (!timeLimit || typeof timeLimit !== 'number' || timeLimit <= 0) {
      console.log('Timer başlatılmadı: timeLimit geçersiz', { timeLimit });
      return; // No timer for this quiz.
    }

    console.log('Timer başlatılıyor:', { timeLimit, timeLeftInSeconds: timeLimit * 60 });

    const timerId = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime === null || prevTime <= 1) {
          clearInterval(timerId);
          setTimeout(() => { // Use setTimeout to prevent issues with alerts/state updates in intervals
            setShowTimeUpModal(true);
          }, 0);
          return 0;
        }
        
        // Son 5 dakikada uyarı göster
        if (prevTime === 300 && !showWarning) { // 5 dakika = 300 saniye
          setShowWarning(true);
          setTimeout(() => setShowWarning(false), 5000); // 5 saniye sonra uyarıyı gizle
        }
        
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLimit, showWarning]); // Dependency array is stable, so this runs only once on mount.

  
  const formatTime = (seconds: number | null) => {
    if (seconds === null) return null;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const getTimeColor = () => {
    if (timeLeft === null) return 'text-gray-900 dark:text-white';
    if (timeLeft <= 300) return 'text-red-600 dark:text-red-400'; // Son 5 dakika kırmızı
    if (timeLeft <= 600) return 'text-yellow-600 dark:text-yellow-400'; // Son 10 dakika sarı
    return 'text-gray-900 dark:text-white';
  };

  const handleSelectAnswer = (questionId: string, answer: string) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const goToNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const goToPrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleTimeUpConfirm = () => {
    setShowTimeUpModal(false);
    onFinishRef.current(userAnswersRef.current);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col">
      <header className="bg-white dark:bg-gray-800 p-4 shadow-md flex justify-between items-center sticky top-0 z-10 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-lg md:text-xl font-bold text-indigo-600 dark:text-indigo-400 truncate pr-4">{quizName}</h1>
        <div className="flex items-center gap-4">
            {timeLeft !== null && (
              <div className={`flex items-center text-lg font-semibold bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg transition-colors ${timeLeft <= 300 ? 'animate-pulse' : ''}`}>
                <ClockIcon className="w-6 h-6 mr-2" />
                <span className={getTimeColor()}>{formatTime(timeLeft)}</span>
              </div>
            )}
            <button onClick={handleFinish} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm md:text-base">
                Sınavı Bitir
            </button>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center p-4 md:p-8">
        <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            {/* Progress Bar */}
            <div className="mb-6">
                <div className="flex justify-between mb-1">
                    <span className="text-base font-medium text-gray-500 dark:text-gray-400">Soru {currentQuestionIndex + 1} / {totalQuestions}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}></div>
                </div>
            </div>

            {/* Question */}
            <div className="mb-8 min-h-[6rem]">
                <h2 className="text-2xl font-semibold leading-relaxed">{currentQuestion.question}</h2>
            </div>

            {/* Options */}
            <div className="space-y-4">
                {currentQuestion.options.map(option => (
                    <label key={option} className={`block w-full text-left p-4 rounded-lg transition-all duration-200 cursor-pointer border-2 ${userAnswers[currentQuestion.id] === option ? 'bg-indigo-50 dark:bg-indigo-900/50 border-indigo-500' : 'bg-gray-100 dark:bg-gray-700 border-transparent hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                        <input
                            type="radio"
                            name={currentQuestion.id}
                            value={option}
                            checked={userAnswers[currentQuestion.id] === option}
                            onChange={() => handleSelectAnswer(currentQuestion.id, option)}
                            className="hidden"
                        />
                        <span className="text-lg">{option}</span>
                    </label>
                ))}
            </div>

            {/* Navigation */}
            <div className="mt-10 flex justify-between items-center">
                <button onClick={goToPrev} disabled={currentQuestionIndex === 0} className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-900 dark:text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    Önceki
                </button>
                {currentQuestionIndex === totalQuestions - 1 ? (
                    <button onClick={handleFinish} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                        Sınavı Bitir
                    </button>
                ) : (
                    <button onClick={goToNext} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                        Sonraki
                    </button>
                )}
            </div>
        </div>
      </main>

      {/* Süre Uyarısı */}
      {showWarning && (
        <div className="fixed top-4 right-4 bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-lg z-40 animate-bounce">
          <div className="flex items-center">
            <ClockIcon className="w-5 h-5 mr-2" />
            <span className="font-semibold">Dikkat! Sadece 5 dakikanız kaldı!</span>
          </div>
        </div>
      )}

      {/* Süre Doldu Modal */}
      {showTimeUpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md mx-4 shadow-2xl border border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900 mb-4">
                <ClockIcon className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Süre Doldu!
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Sınavınızın süresi dolmuştur. Cevaplarınız otomatik olarak kaydedilecektir.
              </p>
              <button
                onClick={handleTimeUpConfirm}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Sınavı Bitir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizSessionPage;