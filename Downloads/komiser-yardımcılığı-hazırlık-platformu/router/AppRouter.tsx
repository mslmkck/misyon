import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import HomePage from '../pages/HomePage';
import LessonsPage from '../pages/LessonsPage';
import QuestionsPage from '../pages/QuestionsPage';
import ExamsPage from '../pages/ExamsPage';
import FlashcardsPage from '../pages/FlashcardsPage';
import StatsPage from '../pages/StatsPage';
import AdminPage from '../pages/AdminPage';
import LoginPage from '../pages/LoginPage';
import SettingsPage from '../pages/SettingsPage';
import FavoritesPage from '../pages/FavoritesPage';
import QuizSessionPage from '../pages/QuizSessionPage';
import ResultsPage from '../pages/ResultsPage';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AppRouter: React.FC = () => {
  const { 
    isAuthenticated, 
    quizState, 
    resultsState,
    user,
    subjects,
    questionsBySubject,
    exams,
    flashcardsBySubject,
    handleLoginSuccess,
    handleLogout,
    startQuiz,
    handleQuizFinish,
    handleResultsBack,
    setUser,
    setSubjects,
    setQuestionsBySubject,
    setExams,
    setFlashcardsBySubject
  } = useAppStore();

  // Protected Route Component
  const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
  };

  // Layout Component for authenticated pages
  const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="min-h-screen flex flex-col bg-gray-900 font-sans">
      <Header onLogout={handleLogout} user={user} />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );

  return (
    <BrowserRouter>
      <Routes>
        {/* Quiz Session Route */}
        {quizState && (
          <Route 
            path="*" 
            element={
              <div className="min-h-screen flex flex-col bg-gray-900 dark:bg-gray-50 font-sans transition-colors duration-300">
                <Header onLogout={handleLogout} user={user} />
                <main className="flex-grow">
                  <QuizSessionPage
                    questions={quizState.questions}
                    timeLimit={quizState.timeLimit}
                    quizName={quizState.name}
                    onFinish={handleQuizFinish}
                  />
                </main>
              </div>
            } 
          />
        )}
        
        {/* Results Route */}
        {resultsState && (
          <Route 
            path="*" 
            element={
              <Layout>
                <ResultsPage 
                  questions={resultsState.questions}
                  userAnswers={resultsState.userAnswers}
                  quizName={resultsState.name}
                  onBack={handleResultsBack}
                />
              </Layout>
            } 
          />
        )}
        
        {/* Normal Routes - only when no quiz or results state */}
        {!quizState && !resultsState && (
          <>
            {/* Public Routes */}
            <Route 
              path="/login" 
              element={
                isAuthenticated ? 
                <Navigate to="/" replace /> : 
                <LoginPage onLoginSuccess={handleLoginSuccess} />
              } 
            />

            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <HomePage />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/lessons" element={
              <ProtectedRoute>
                <Layout>
                  <LessonsPage />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/questions" element={
              <ProtectedRoute>
                <Layout>
                  <QuestionsPage />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/exams" element={
              <ProtectedRoute>
                <Layout>
                  <ExamsPage />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/flashcards" element={
              <ProtectedRoute>
                <Layout>
                  <FlashcardsPage />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/stats" element={
              <ProtectedRoute>
                <Layout>
                  <StatsPage />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/settings" element={
              <ProtectedRoute>
                <Layout>
                  <SettingsPage />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/favorites" element={
              <ProtectedRoute>
                <Layout>
                  <FavoritesPage />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/admin" element={
              <ProtectedRoute>
                <Layout>
                  <AdminPage />
                </Layout>
              </ProtectedRoute>
            } />

            {/* Catch all route - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;