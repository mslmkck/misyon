import React, { useState, useMemo } from 'react';
import { useFavorites, useQuiz } from '../store/appStore';
import PageHeader from '../components/PageHeader';
import FavoriteButton from '../components/FavoriteButton';
import type { Question } from '../types';

const FavoritesPage: React.FC = () => {
  const { getFavoriteQuestions, favoriteQuestions: favoriteQuestionIds } = useFavorites();
  const { startQuiz } = useQuiz();
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  
  // Memoize the favorite questions to prevent infinite loops
  const favoriteQuestions = useMemo(() => {
    return getFavoriteQuestions();
  }, [favoriteQuestionIds]);

  const handleQuestionSelect = (questionId: string) => {
    setSelectedQuestions(prev => 
      prev.includes(questionId) 
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const handleSelectAll = () => {
    if (selectedQuestions.length === favoriteQuestions.length) {
      setSelectedQuestions([]);
    } else {
      setSelectedQuestions(favoriteQuestions.map(q => q.id));
    }
  };

  const handleStartQuiz = () => {
    if (selectedQuestions.length === 0) return;
    
    const selectedQuestionObjects = favoriteQuestions.filter(q => 
      selectedQuestions.includes(q.id)
    );
    
    startQuiz(selectedQuestionObjects, null, `Favori Sorular (${selectedQuestions.length} Soru)`);
  };

  if (favoriteQuestions.length === 0) {
    return (
      <div>
        <PageHeader 
          title="Favori Sorular" 
          description="Favorilere eklediğiniz sorular burada görünür" 
        />
        
        <div className="text-center py-16">
          <div className="mb-6">
            <svg className="w-24 h-24 mx-auto text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-300 dark:text-gray-600 mb-4">
            Henüz favori sorunuz yok
          </h3>
          <p className="text-gray-400 dark:text-gray-500 max-w-md mx-auto">
            Sorular sayfasından beğendiğiniz soruları favorilere ekleyerek buradan kolayca erişebilirsiniz.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader 
        title="Favori Sorular" 
        description={`${favoriteQuestions.length} favori sorunuz var`} 
      />
      
      {/* Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleSelectAll}
            className="px-4 py-2 bg-gray-700 dark:bg-blue-100 text-white dark:text-blue-700 rounded-lg hover:bg-gray-600 dark:hover:bg-blue-200 transition-colors duration-300 text-sm"
          >
            {selectedQuestions.length === favoriteQuestions.length ? 'Tümünü Kaldır' : 'Tümünü Seç'}
          </button>
          
          {selectedQuestions.length > 0 && (
            <span className="px-3 py-2 bg-indigo-600 dark:bg-blue-500 text-white rounded-lg text-sm">
              {selectedQuestions.length} soru seçildi
            </span>
          )}
        </div>
        
        {selectedQuestions.length > 0 && (
          <button
            onClick={handleStartQuiz}
            className="px-6 py-2 bg-green-600 dark:bg-blue-600 text-white rounded-lg hover:bg-green-700 dark:hover:bg-blue-700 transition-colors duration-300 font-medium"
          >
            Seçili Sorularla Quiz Başlat
          </button>
        )}
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {favoriteQuestions.map((question, index) => (
          <div
            key={question.id}
            className={`bg-gray-800 dark:bg-white rounded-lg p-6 border-2 transition-all duration-300 cursor-pointer ${
              selectedQuestions.includes(question.id)
                ? 'border-indigo-500 dark:border-blue-500 bg-indigo-900/20 dark:bg-blue-50'
                : 'border-transparent dark:border-blue-100 hover:border-gray-600 dark:hover:border-blue-200'
            }`}
            onClick={() => handleQuestionSelect(question.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-sm font-medium text-indigo-400 dark:text-blue-600">
                    Soru {index + 1}
                  </span>
                  <input
                    type="checkbox"
                    checked={selectedQuestions.includes(question.id)}
                    onChange={() => handleQuestionSelect(question.id)}
                    className="w-4 h-4 text-indigo-600 dark:text-blue-600 bg-gray-700 dark:bg-gray-100 border-gray-600 dark:border-blue-300 rounded focus:ring-indigo-500 dark:focus:ring-blue-500 focus:ring-2"
                  />
                </div>
                
                <h3 className="text-lg font-medium text-white dark:text-gray-900 mb-4 leading-relaxed">
                  {question.question}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {question.options.map((option, optionIndex) => (
                    <div
                      key={optionIndex}
                      className={`p-3 rounded-lg text-sm ${
                        option === question.answer
                          ? 'bg-green-600/20 dark:bg-green-100 text-green-300 dark:text-green-700 border border-green-500/30 dark:border-green-300'
                          : 'bg-gray-700 dark:bg-blue-50 text-gray-300 dark:text-blue-600'
                      }`}
                    >
                      <span className="font-medium mr-2">
                        {String.fromCharCode(65 + optionIndex)})
                      </span>
                      {option}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="ml-4">
                <FavoriteButton questionId={question.id} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;