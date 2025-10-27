import React, { useEffect, useState } from 'react';
import type { Question } from '../types';
import { CheckCircleIcon, XCircleIcon } from '../components/Icons';
import { dbHelpers, supabase } from '../src/lib/supabase';

interface ResultsPageProps {
  questions: Question[];
  userAnswers: Record<string, string>;
  quizName: string;
  source?: 'questions' | 'exams';
  onBackToList: () => void;
  onGoHome: () => void;
}

const ResultsPage: React.FC<ResultsPageProps> = ({ questions, userAnswers, quizName, source = 'questions', onBackToList, onGoHome }) => {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const correctAnswersCount = questions.filter(q => userAnswers[q.id] === q.answer).length;
  const answeredCount = Object.keys(userAnswers).length;
  const incorrectAnswersCount = answeredCount - correctAnswersCount;
  const unansweredCount = questions.length - answeredCount;
  const score = questions.length > 0 ? ((correctAnswersCount / questions.length) * 100).toFixed(0) : '0';

  // Quiz sonuçlarını veritabanına kaydet
  useEffect(() => {
    const saveQuizResults = async () => {
      try {
        setSaving(true);
        
        // Kullanıcı oturum kontrolü
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.log('Kullanıcı oturumu bulunamadı, sonuçlar kaydedilmedi');
          return;
        }

        // Quiz session oluştur
        const quizSession = await dbHelpers.createQuizSession({
          user_id: user.id,
          quiz_type: source,
          quiz_id: null, // Şimdilik null, ileride quiz ID'si eklenebilir
          subject_id: null, // Şimdilik null, ileride subject ID'si eklenebilir
          total_questions: questions.length,
          correct_answers: correctAnswersCount,
          wrong_answers: incorrectAnswersCount,
          score: parseFloat(score),
          time_spent: null, // Şimdilik null, ileride süre bilgisi eklenebilir
          completed_at: new Date().toISOString()
        });

        // Her soru için cevabı kaydet
        for (const question of questions) {
          const userAnswer = userAnswers[question.id];
          if (userAnswer) {
            await dbHelpers.saveQuestionAnswer({
              user_id: user.id,
              question_id: question.id,
              selected_answer: userAnswer,
              is_correct: userAnswer === question.answer,
              quiz_session_id: quizSession.id,
              answered_at: new Date().toISOString()
            });
          }
        }

        setSaved(true);
        console.log('Quiz sonuçları başarıyla kaydedildi');
      } catch (error) {
        console.error('Quiz sonuçları kaydedilirken hata:', error);
      } finally {
        setSaving(false);
      }
    };

    saveQuizResults();
  }, [questions, userAnswers, correctAnswersCount, incorrectAnswersCount, score, source]);

  return (
    <div>
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Sınav Sonucu</h1>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">{quizName}</p>
            </div>
            <div className="flex gap-4">
                <button onClick={onBackToList} className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-900 dark:text-white font-bold py-2 px-4 rounded-lg transition-colors">
                    Listeye Geri Dön
                </button>
                <button onClick={onGoHome} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                    Anasayfaya Dön
                </button>
            </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center border border-gray-200 dark:border-gray-700">
          <p className="text-5xl font-bold text-indigo-500 dark:text-indigo-400">{score}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Puan</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center border border-gray-200 dark:border-gray-700">
          <p className="text-5xl font-bold text-green-500">{correctAnswersCount}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Doğru</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center border border-gray-200 dark:border-gray-700">
          <p className="text-5xl font-bold text-red-500">{incorrectAnswersCount}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Yanlış</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center border border-gray-200 dark:border-gray-700">
          <p className="text-5xl font-bold text-gray-500">{unansweredCount}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Boş</p>
        </div>
      </div>
      
      {/* Save Status Messages */}
      {saving && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-700 rounded-lg">
          <p className="text-blue-700 dark:text-blue-300">Sonuçlar kaydediliyor...</p>
        </div>
      )}
      {saved && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-700 rounded-lg">
          <p className="text-green-700 dark:text-green-300">✓ Sonuçlar başarıyla kaydedildi</p>
        </div>
      )}
      
      {/* Detailed Analysis */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Soru Analizi</h3>
        <div className="space-y-8">
          {questions.map((question, index) => {
            const userAnswer = userAnswers[question.id];
            const isCorrect = userAnswer === question.answer;

            return (
              <div key={question.id} className="border-b border-gray-200 dark:border-gray-700 pb-8 last:border-b-0">
                <div className="flex justify-between items-start">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Soru {index + 1}: {question.question}</h4>
                  {userAnswer ? (
                     isCorrect ? <CheckCircleIcon className="w-8 h-8 text-green-500 flex-shrink-0 ml-4" /> : <XCircleIcon className="w-8 h-8 text-red-500 flex-shrink-0 ml-4" />
                  ) : <span className="text-gray-500 font-bold ml-4 flex-shrink-0">BOŞ</span>}
                </div>
                <div className="space-y-2 mt-2">
                  {question.options.map(option => {
                    const isUserAnswer = userAnswer === option;
                    const isCorrectAnswer = question.answer === option;
                    let optionClass = 'bg-gray-100 dark:bg-gray-700 border-transparent';
                    
                    if(isCorrectAnswer) {
                        optionClass = 'bg-green-100 dark:bg-green-900/50 border-green-500';
                    }
                    if(isUserAnswer && !isCorrectAnswer) {
                        optionClass = 'bg-red-100 dark:bg-red-900/50 border-red-500';
                    }
                    
                    return (
                      <div key={option} className={`p-3 rounded-lg border ${optionClass}`}>
                        <p className="text-gray-800 dark:text-gray-200">
                            {option}
                            {isUserAnswer && <span className="text-xs font-bold ml-2 text-yellow-600 dark:text-yellow-300">(Sizin Cevabınız)</span>}
                            {isCorrectAnswer && <span className="text-xs font-bold ml-2 text-green-700 dark:text-green-300">(Doğru Cevap)</span>}
                        </p>
                      </div>
                    );
                  })}
                </div>
                {question.explanation && (
                    <div className="mt-4 bg-gray-100 dark:bg-gray-900/50 p-4 rounded-lg">
                        <h5 className="font-bold text-indigo-600 dark:text-indigo-400 mb-2">Açıklama:</h5>
                        <p className="text-gray-700 dark:text-gray-300">{question.explanation}</p>
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