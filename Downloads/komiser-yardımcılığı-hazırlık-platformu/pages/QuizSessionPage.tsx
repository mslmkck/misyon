import React, { useState, useEffect, useRef } from 'react';
import type { Question } from '../types';
import { ClockIcon, XCircleIcon, CheckCircleIcon } from '../components/Icons';
import FavoriteButton from '../components/FavoriteButton';

interface QuizSessionPageProps {
  questions: Question[];
  timeLimit: number | null; // in minutes
  quizName: string;
  onFinish: (answers: Record<string, string>) => void;
}

const QuizSessionPage: React.FC<QuizSessionPageProps> = ({ questions, timeLimit, quizName, onFinish }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(timeLimit ? timeLimit * 60 : null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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
    setShowConfirmModal(true);
  };

  const confirmFinish = () => {
    setShowConfirmModal(false);
    onFinish(userAnswers);
  };

  const cancelFinish = () => {
    setShowConfirmModal(false);
  };

  // Stable timer effect that runs only once.
  useEffect(() => {
    if (timeLimit === null) return; // No timer for this quiz.

    const timerId = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime === null || prevTime <= 1) {
          clearInterval(timerId);
          setTimeout(() => { // Use setTimeout to prevent issues with alerts/state updates in intervals
            alert("Süre doldu! Sınavınız otomatik olarak tamamlandı.");
            onFinishRef.current(userAnswersRef.current);
          }, 0);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLimit]); // Dependency array is stable, so this runs only once on mount.

  
  const formatTime = (seconds: number | null) => {
    if (seconds === null) return null;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
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

  return (
    <div className="min-h-screen bg-gray-900 dark:bg-gray-50 text-white dark:text-gray-900 flex flex-col transition-colors duration-300">
      <div className="bg-gray-800 dark:bg-white p-4 shadow-md flex justify-between items-center sticky top-16 z-10 transition-colors duration-300">
        <h1 className="text-lg md:text-xl font-bold text-indigo-400 dark:text-indigo-600 truncate pr-4 transition-colors duration-300">{quizName}</h1>
        <div className="flex items-center gap-4">
            {timeLeft !== null && (
              <div className="flex items-center text-lg font-semibold bg-gray-700 dark:bg-gray-100 px-4 py-2 rounded-lg text-white dark:text-gray-900 transition-colors duration-300">
                <ClockIcon className="w-6 h-6 mr-2" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}
            <button onClick={handleFinish} className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm md:text-base">
                Sınavı Bitir
            </button>
        </div>
      </div>

      <main className="flex-grow flex flex-col items-center p-4 md:p-8">
        <div className="w-full max-w-4xl bg-gray-800 dark:bg-white rounded-xl shadow-2xl p-8 border border-gray-700 dark:border-gray-200 transition-colors duration-300">
            {/* Progress Bar */}
            <div className="mb-6">
                <div className="flex justify-between mb-1">
                    <span className="text-base font-medium text-gray-400 dark:text-gray-600 transition-colors duration-300">Soru {currentQuestionIndex + 1} / {totalQuestions}</span>
                </div>
                <div className="w-full bg-gray-700 dark:bg-gray-200 rounded-full h-2.5 transition-colors duration-300">
                    <div className="bg-indigo-600 dark:bg-blue-500 h-2.5 rounded-full transition-colors duration-300" style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}></div>
                </div>
            </div>

            {/* Question */}
            <div className="mb-8 min-h-[6rem]">
                <div className="flex items-start justify-between gap-4">
                    <h2 className="text-2xl font-semibold leading-relaxed flex-1 text-white dark:text-gray-900 transition-colors duration-300">{currentQuestion.question}</h2>
                    <FavoriteButton questionId={currentQuestion.id} className="flex-shrink-0" />
                </div>
            </div>

            {/* Options */}
            <div className="space-y-4">
                {currentQuestion.options.map(option => (
                    <label key={option} className={`block w-full text-left p-4 rounded-lg transition-all duration-200 cursor-pointer border-2 ${userAnswers[currentQuestion.id] === option ? 'bg-indigo-900 dark:bg-blue-100 border-indigo-500 dark:border-blue-400' : 'bg-gray-700 dark:bg-gray-50 border-transparent hover:bg-gray-600 dark:hover:bg-gray-100'}`}>
                        <input
                            type="radio"
                            name={currentQuestion.id}
                            value={option}
                            checked={userAnswers[currentQuestion.id] === option}
                            onChange={() => handleSelectAnswer(currentQuestion.id, option)}
                            className="hidden"
                        />
                        <span className="text-lg text-white dark:text-gray-900 transition-colors duration-300">{option}</span>
                    </label>
                ))}
            </div>

            {/* Navigation */}
            <div className="mt-10 flex justify-between items-center">
                <button onClick={goToPrev} disabled={currentQuestionIndex === 0} className="bg-gray-600 dark:bg-gray-300 hover:bg-gray-500 dark:hover:bg-gray-400 text-white dark:text-gray-900 font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    Önceki
                </button>
                {currentQuestionIndex === totalQuestions - 1 ? (
                    <button onClick={handleFinish} className="bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                        Sınavı Bitir
                    </button>
                ) : (
                    <button onClick={goToNext} className="bg-indigo-600 dark:bg-blue-500 hover:bg-indigo-700 dark:hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                        Sonraki
                    </button>
                )}
            </div>
        </div>
      </main>

      {/* Modern Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 dark:bg-white rounded-xl shadow-2xl max-w-md w-full border border-gray-700 dark:border-gray-200 transition-colors duration-300">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-yellow-500/20 dark:bg-yellow-100 p-3 rounded-full mr-4 transition-colors duration-300">
                  <XCircleIcon className="w-6 h-6 text-yellow-500 dark:text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-white dark:text-gray-900 transition-colors duration-300">Sınavı Bitir</h3>
              </div>
              
              <p className="text-gray-300 dark:text-gray-600 mb-6 leading-relaxed transition-colors duration-300">
                Sınavı bitirmek istediğinizden emin misiniz? Cevaplanmamış sorular boş olarak kabul edilecektir.
              </p>
              
              <div className="flex gap-3 justify-end">
                <button 
                  onClick={cancelFinish}
                  className="px-4 py-2 bg-gray-600 dark:bg-gray-300 hover:bg-gray-500 dark:hover:bg-gray-400 text-white dark:text-gray-900 font-medium rounded-lg transition-colors"
                >
                  İptal
                </button>
                <button 
                  onClick={confirmFinish}
                  className="px-4 py-2 bg-red-600 dark:bg-red-500 hover:bg-red-700 dark:hover:bg-red-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                  <CheckCircleIcon className="w-4 h-4" />
                  Sınavı Bitir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizSessionPage;