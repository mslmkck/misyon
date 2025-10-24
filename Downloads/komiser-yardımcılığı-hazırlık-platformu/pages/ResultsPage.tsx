import React from 'react';
import type { Question } from '../types';
import PageHeader from '../components/PageHeader';
import { CheckCircleIcon, XCircleIcon } from '../components/Icons';
import FavoriteButton from '../components/FavoriteButton';

interface ResultsPageProps {
  questions: Question[];
  userAnswers: Record<string, string>;
  quizName: string;
  onBack: () => void;
}

const ResultsPage: React.FC<ResultsPageProps> = ({ questions, userAnswers, quizName, onBack }) => {
  const correctAnswersCount = questions.filter(q => userAnswers[q.id] === q.answer).length;
  const incorrectAnswersCount = Object.values(userAnswers).filter(answer => answer !== undefined).length - correctAnswersCount;
  const unansweredCount = questions.length - Object.values(userAnswers).filter(answer => answer !== undefined).length;
  const score = questions.length > 0 ? ((correctAnswersCount / questions.length) * 100).toFixed(0) : 0;

  return (
    <div>
      <PageHeader title="Sınav Sonucu" subtitle={quizName} onBack={onBack} />

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
          <p className="text-5xl font-bold text-indigo-400">{score}</p>
          <p className="text-sm text-gray-400 mt-2">Puan</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
          <p className="text-5xl font-bold text-green-400">{correctAnswersCount}</p>
          <p className="text-sm text-gray-400 mt-2">Doğru</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
          <p className="text-5xl font-bold text-red-400">{incorrectAnswersCount}</p>
          <p className="text-sm text-gray-400 mt-2">Yanlış</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
          <p className="text-5xl font-bold text-gray-500">{unansweredCount}</p>
          <p className="text-sm text-gray-400 mt-2">Boş</p>
        </div>
      </div>
      
      {/* Detailed Analysis */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
        <h3 className="text-2xl font-bold text-white mb-6">Soru Analizi</h3>
        <div className="space-y-8">
          {questions.map((question, index) => {
            const userAnswer = userAnswers[question.id];
            const isCorrect = userAnswer === question.answer;

            return (
              <div key={question.id} className="border-b border-gray-700 pb-8 last:border-b-0">
                <div className="flex justify-between items-start">
                  <h4 className="text-lg font-semibold text-white mb-4 flex-1">Soru {index + 1}: {question.question}</h4>
                  <div className="flex items-center gap-2 ml-4">
                    <FavoriteButton questionId={question.id} className="flex-shrink-0" />
                    {userAnswer ? (
                       isCorrect ? <CheckCircleIcon className="w-8 h-8 text-green-500 flex-shrink-0" /> : <XCircleIcon className="w-8 h-8 text-red-500 flex-shrink-0" />
                    ) : <span className="text-gray-500 font-bold flex-shrink-0">BOŞ</span>}
                  </div>
                </div>
                <div className="space-y-2 mt-2">
                  {question.options.map(option => {
                    const isUserAnswer = userAnswer === option;
                    const isCorrectAnswer = question.answer === option;
                    let optionClass = 'bg-gray-700 border-transparent';
                    
                    if(isCorrectAnswer) {
                        optionClass = 'bg-green-900/50 border-green-500';
                    }
                    if(isUserAnswer && !isCorrectAnswer) {
                        optionClass = 'bg-red-900/50 border-red-500';
                    }
                    
                    return (
                      <div key={option} className={`p-3 rounded-lg border ${optionClass}`}>
                        <p>
                            {option}
                            {isUserAnswer && <span className="text-xs font-bold ml-2 text-yellow-300">(Sizin Cevabınız)</span>}
                            {isCorrectAnswer && <span className="text-xs font-bold ml-2 text-green-300">(Doğru Cevap)</span>}
                        </p>
                      </div>
                    );
                  })}
                </div>
                {question.explanation && (
                    <div className="mt-4 bg-gray-900/50 p-4 rounded-lg">
                        <h5 className="font-bold text-indigo-400 mb-2">Açıklama:</h5>
                        <p className="text-gray-300">{question.explanation}</p>
                    </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default ResultsPage;