
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardCard from '../components/DashboardCard';
import StatSummaryCard from '../components/StatSummaryCard';
import PerformanceChart from '../components/PerformanceChart';
import FavoriteButton from '../components/FavoriteButton';
import { useProgress, useAppData, useFavorites, useQuiz } from '../store/appStore';
import {
  BookOpenIcon,
  QuestionMarkCircleIcon,
  ClipboardListIcon,
  CollectionIcon,
  ChartBarIcon,
  HeartIcon,
} from '../components/Icons';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { userProgress, getOverallProgress, getSubjectProgress } = useProgress();
  const { subjects } = useAppData();
  const { getFavoriteQuestions, favoriteQuestions: favoriteQuestionIds } = useFavorites();
  const { startQuiz } = useQuiz();
  
  // Memoize calculations to prevent infinite loops
  const overallProgress = useMemo(() => getOverallProgress(), [userProgress]);
  
  // Memoize calculations to prevent infinite loops
  const favoriteQuestions = useMemo(() => {
    return getFavoriteQuestions();
  }, [favoriteQuestionIds]);

  const handleSolveQuestion = (question: any) => {
    // Tek soru ile quiz başlat
    startQuiz([question], null, `Favori Soru: ${question.question.substring(0, 50)}...`);
  };
  
  const totalQuestionsAnswered = userProgress.totalQuestionsAnswered;
  
  const accuracyRate = useMemo(() => {
    return userProgress.totalQuestionsAnswered > 0 
      ? Math.round((userProgress.totalCorrectAnswers / userProgress.totalQuestionsAnswered) * 100)
      : 0;
  }, [userProgress.totalQuestionsAnswered, userProgress.totalCorrectAnswers]);
  
  // Get last quiz score
  const lastExamScore = useMemo(() => {
    const quizScores = Object.values(userProgress.quizScores);
    return quizScores.length > 0 ? quizScores[quizScores.length - 1] : null;
  }, [userProgress.quizScores]);
  
  // Calculate subject performance for chart
  const subjectPerformance = useMemo(() => {
    return subjects.map(subject => {
      const progress = getSubjectProgress(subject.id);
      return {
        subject: subject.name.split(' ')[0], // Shortened name for chart
        score: progress.averageScore || 0
      };
    }).filter(item => item.score > 0); // Only show subjects with progress
  }, [subjects, userProgress]);

  const dashboardItems = [
    { path: '/lessons', title: 'Dersler', description: 'Konu anlatımları ve ders notları.', icon: <BookOpenIcon className="w-6 h-6 text-indigo-400 dark:text-blue-600 group-hover:text-gray-800 dark:group-hover:text-blue-700 transition-colors duration-300" /> },
    { path: '/questions', title: 'Sorular', description: 'Binlerce soru ile pratik yapın.', icon: <QuestionMarkCircleIcon className="w-6 h-6 text-indigo-400 dark:text-blue-600 group-hover:text-gray-800 dark:group-hover:text-blue-700 transition-colors duration-300" /> },
    { path: '/exams', title: 'Denemeler', description: 'Gerçek sınav formatında denemeler çözün.', icon: <ClipboardListIcon className="w-6 h-6 text-indigo-400 dark:text-blue-600 group-hover:text-gray-800 dark:group-hover:text-blue-700 transition-colors duration-300" /> },
    { path: '/flashcards', title: 'Bilgi Kartları', description: 'Önemli bilgileri hızlıca tekrar edin.', icon: <CollectionIcon className="w-6 h-6 text-indigo-400 dark:text-blue-600 group-hover:text-gray-800 dark:group-hover:text-blue-700 transition-colors duration-300" /> },
  ];

  return (
    <div className="space-y-8 md:space-y-12">
      <div className="text-center md:text-left">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white dark:text-gray-900 tracking-tight transition-colors duration-300">
          Hoş Geldiniz, Aday Memur!
        </h1>
        <p className="mt-2 text-base sm:text-lg text-gray-400 dark:text-gray-600 transition-colors duration-300">
          Sınav hazırlık yolculuğunuzda yanınızdayız.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {dashboardItems.map(item => (
          <DashboardCard
            key={item.path}
            title={item.title}
            description={item.description}
            icon={item.icon}
            onClick={() => navigate(item.path)}
          />
        ))}
      </div>

      {/* Favori Sorular Bölümü - Minimal Tasarım */}
      {favoriteQuestions.length > 0 && (
        <div className="bg-gray-800 dark:bg-white p-4 rounded-lg shadow-lg border dark:border-gray-200 transition-colors duration-300">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-white dark:text-gray-900 transition-colors duration-300 flex items-center gap-2">
              <HeartIcon className="w-5 h-5 text-red-500" />
              Favori Sorular
            </h2>
            <button 
              onClick={() => navigate('/favorites')} 
              className="text-indigo-400 dark:text-blue-600 font-medium hover:text-indigo-300 dark:hover:text-blue-700 transition-colors text-sm"
            >
              Tümünü Gör ({favoriteQuestions.length})
            </button>
          </div>
          <div className="space-y-2">
            {favoriteQuestions.slice(0, 3).map((question, index) => (
              <div key={question.id} className="bg-gray-700 dark:bg-blue-50 rounded-md p-3 border dark:border-blue-100 transition-colors duration-300 hover:bg-gray-600 dark:hover:bg-blue-100">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-white dark:text-gray-900 text-sm leading-relaxed truncate">
                      {question.question}
                    </p>
                    <span className="text-xs text-gray-400 dark:text-blue-600 mt-1 block">
                      {question.subject || 'Genel'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <FavoriteButton questionId={question.id} />
                    <button
                      onClick={() => handleSolveQuestion(question)}
                      className="text-xs text-indigo-400 dark:text-blue-600 hover:text-indigo-300 dark:hover:text-blue-700 transition-colors"
                    >
                      Çöz
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-gray-800 dark:bg-white p-4 md:p-6 rounded-lg shadow-xl border dark:border-gray-200 transition-colors duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
            <h2 className="text-xl md:text-2xl font-bold text-white dark:text-gray-900 transition-colors duration-300">Genel Bakış</h2>
            <button 
              onClick={() => navigate('/stats')} 
              className="text-indigo-400 dark:text-blue-600 font-semibold hover:text-indigo-300 dark:hover:text-blue-700 transition-colors text-sm md:text-base"
            >
              Detayları Gör
            </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            <StatSummaryCard label="Genel İlerleme" value={`${overallProgress}%`} icon={<ChartBarIcon className="w-5 h-5 text-white dark:text-blue-600 transition-colors duration-300"/>} />
            <StatSummaryCard label="Son Deneme Puanı" value={lastExamScore ? `${lastExamScore}%` : 'Henüz yok'} icon={<ClipboardListIcon className="w-5 h-5 text-white dark:text-blue-600 transition-colors duration-300"/>}/>
            <StatSummaryCard label="Çözülen Soru" value={totalQuestionsAnswered.toString()} icon={<QuestionMarkCircleIcon className="w-5 h-5 text-white dark:text-blue-600 transition-colors duration-300"/>} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
            <div>
                <h3 className="text-lg md:text-xl font-bold text-white dark:text-gray-900 mb-4 transition-colors duration-300">Ders Performansı</h3>
                {subjectPerformance.length > 0 ? (
                    <PerformanceChart data={subjectPerformance} />
                ) : (
                    <div className="bg-gray-700 dark:bg-blue-50 rounded-lg p-4 md:p-6 text-center border dark:border-blue-100 transition-colors duration-300">
                        <p className="text-gray-400 dark:text-blue-600 text-sm md:text-base transition-colors duration-300">
                          Henüz test çözmediniz. İlerlemenizi görmek için testlere başlayın!
                        </p>
                    </div>
                )}
            </div>
            <div>
                <h3 className="text-lg md:text-xl font-bold text-white dark:text-gray-900 mb-4 transition-colors duration-300">Başarı Oranı</h3>
                <div className="bg-gray-700 dark:bg-blue-50 rounded-lg p-4 md:p-6 border dark:border-blue-100 transition-colors duration-300">
                    <div className="text-center">
                        <div className="text-3xl md:text-4xl font-bold text-indigo-400 dark:text-blue-600 mb-2 transition-colors duration-300">{accuracyRate}%</div>
                        <p className="text-gray-400 dark:text-blue-600 text-sm md:text-base transition-colors duration-300">Doğru Cevap Oranı</p>
                        <div className="mt-4 bg-gray-600 dark:bg-blue-200 rounded-full h-2 md:h-3 transition-colors duration-300">
                            <div 
                                className="bg-indigo-500 dark:bg-blue-500 h-2 md:h-3 rounded-full transition-all duration-500" 
                                style={{ width: `${accuracyRate}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
