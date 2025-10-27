
import React, { useState, useEffect } from 'react';
import type { Page, Subject, QuizTest, MockExam, FlashcardsBySubject, User, Question, Theme } from './types';
import HomePage from './pages/HomePage';
import LessonsPage from './pages/LessonsPage';
import QuestionsPage from './pages/QuestionsPage';
import ExamsPage from './pages/ExamsPage';
import FlashcardsPage from './pages/FlashcardsPage';
import StatsPage from './pages/StatsPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './src/components/RegisterPage';
import ForgotPasswordPage from './src/components/ForgotPasswordPage';
import ResetPasswordPage from './src/components/ResetPasswordPage';
import SettingsPage from './pages/SettingsPage';
import QuizSessionPage from './pages/QuizSessionPage';
import ResultsPage from './pages/ResultsPage';
import Header from './components/Header';
import Footer from './components/Footer';
import { SUBJECTS, QUESTIONS_BY_SUBJECT, MOCK_EXAMS, FLASHCARDS_BY_SUBJECT } from './constants';
import { supabase, authHelpers } from './src/lib/supabase';

type QuizSource = 'questions' | 'exams';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [user, setUser] = useState<User>({ name: 'Aday Memur', email: 'aday@prosinav.com', isAdmin: false });
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('proSınav_theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Supabase auth state'ini kontrol et
  useEffect(() => {
    const checkAuthState = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setIsAuthenticated(true);
        
        // Kullanıcı profilini al
        const { data: profile, error } = await authHelpers.getUserProfile(session.user.id);
        
        if (profile) {
          const userData = {
            name: `${profile.first_name} ${profile.last_name}`,
            email: profile.email,
            isAdmin: profile.is_admin
          };
          setUser(userData);
          
          // Admin durumunu local storage'a kaydet (port bağımsız)
          localStorage.setItem('proSınav_user', JSON.stringify(userData));
          localStorage.setItem('proSınav_isAdmin', profile.is_admin ? 'true' : 'false');
        } else {
          // Profil bulunamazsa varsayılan kullanıcı bilgilerini kullan
          const userData = {
            name: session.user.user_metadata?.first_name && session.user.user_metadata?.last_name 
              ? `${session.user.user_metadata.first_name} ${session.user.user_metadata.last_name}`
              : 'Kullanıcı',
            email: session.user.email || 'user@example.com',
            isAdmin: false
          };
          setUser(userData);
          localStorage.setItem('proSınav_user', JSON.stringify(userData));
          localStorage.setItem('proSınav_isAdmin', 'false');
        }
      } else {
        // Oturum yoksa local storage'dan kontrol et
        const savedUser = localStorage.getItem('proSınav_user');
        const savedIsAdmin = localStorage.getItem('proSınav_isAdmin');
        
        if (savedUser && savedIsAdmin) {
          try {
            const userData = JSON.parse(savedUser);
            userData.isAdmin = savedIsAdmin === 'true';
            setUser(userData);
            // Ama authenticated olarak işaretleme - sadece UI için kullan
          } catch (error) {
            console.error('Local storage parse error:', error);
          }
        }
      }
    };

    checkAuthState();

    // Auth state değişikliklerini dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setIsAuthenticated(true);
        
        const { data: profile, error } = await authHelpers.getUserProfile(session.user.id);
        
        if (profile) {
          const userData = {
            name: `${profile.first_name} ${profile.last_name}`,
            email: profile.email,
            isAdmin: profile.is_admin
          };
          setUser(userData);
          
          // Admin durumunu local storage'a kaydet
          localStorage.setItem('proSınav_user', JSON.stringify(userData));
          localStorage.setItem('proSınav_isAdmin', profile.is_admin ? 'true' : 'false');
        } else {
          // Profil bulunamazsa varsayılan kullanıcı bilgilerini kullan
          const userData = {
            name: session.user.user_metadata?.first_name && session.user.user_metadata?.last_name 
              ? `${session.user.user_metadata.first_name} ${session.user.user_metadata.last_name}`
              : 'Kullanıcı',
            email: session.user.email || 'user@example.com',
            isAdmin: false
          };
          setUser(userData);
          localStorage.setItem('proSınav_user', JSON.stringify(userData));
          localStorage.setItem('proSınav_isAdmin', 'false');
        }
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setUser({ name: 'Aday Memur', email: 'aday@prosinav.com', isAdmin: false });
        setCurrentPage('home');
        
        // Local storage'ı temizle
        localStorage.removeItem('proSınav_user');
        localStorage.removeItem('proSınav_isAdmin');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('proSınav_theme', theme);
  }, [theme]);
  
  const [quizState, setQuizState] = useState<{ questions: Question[]; timeLimit: number | null; name: string; source: QuizSource } | null>(null);
  const [resultsState, setResultsState] = useState<{ questions: Question[]; userAnswers: Record<string, string>; name: string; source: QuizSource } | null>(null);


  const [subjects, setSubjects] = useState<Subject[]>(() => {
    try {
      const savedSubjects = localStorage.getItem('proSınav_subjects');
      return savedSubjects ? JSON.parse(savedSubjects) : SUBJECTS;
    } catch (error) {
      console.error("Error loading subjects from localStorage", error);
      return SUBJECTS;
    }
  });

  const [questionsBySubject, setQuestionsBySubject] = useState<Record<string, QuizTest[]>>(() => {
    try {
      const savedQuestions = localStorage.getItem('proSınav_questions');
      return savedQuestions ? JSON.parse(savedQuestions) : QUESTIONS_BY_SUBJECT;
    } catch (error) {
      console.error("Error loading questions from localStorage", error);
      return QUESTIONS_BY_SUBJECT;
    }
  });
  
  const [exams, setExams] = useState<MockExam[]>(() => {
    try {
      const savedExams = localStorage.getItem('proSınav_exams');
      return savedExams ? JSON.parse(savedExams) : MOCK_EXAMS;
    } catch (error) {
      console.error("Error loading exams from localStorage", error);
      return MOCK_EXAMS;
    }
  });

  const [flashcardsBySubject, setFlashcardsBySubject] = useState<FlashcardsBySubject>(() => {
    try {
        const savedFlashcards = localStorage.getItem('proSınav_flashcards');
        return savedFlashcards ? JSON.parse(savedFlashcards) : FLASHCARDS_BY_SUBJECT;
    } catch (error) {
        console.error("Error loading flashcards from localStorage", error);
        return FLASHCARDS_BY_SUBJECT;
    }
  });


  const navigateTo = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleLoginSuccess = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    navigateTo('home');
  };

  const handleLogout = async () => {
    try {
      // Önce UI'ı güncelle (kullanıcı deneyimi için)
      setIsAuthenticated(false);
      setUser({ name: 'Aday Memur', email: 'aday@prosinav.com', isAdmin: false });
      setCurrentPage('home');
      
      // Sonra Supabase'den çıkış yap
      const { error } = await authHelpers.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        // Hata olsa bile UI zaten güncellenmiş durumda
      }
      
      // Local storage'ı temizle
      localStorage.removeItem('proSınav_user');
      localStorage.removeItem('proSınav_auth');
      localStorage.removeItem('proSınav_isAdmin');
      
    } catch (error) {
      console.error('Logout error:', error);
      // UI zaten güncellenmiş durumda, sadece hata logla
    }
  };

  const startQuiz = (questions: Question[], timeLimit: number | null, name: string, source: QuizSource) => {
    setCurrentPage(source); // Update current page to remember source
    setQuizState({ questions, timeLimit, name, source });
  };

  const handleQuizFinish = (userAnswers: Record<string, string>) => {
    if (quizState) {
        setResultsState({
            questions: quizState.questions,
            userAnswers: userAnswers,
            name: quizState.name,
            source: quizState.source,
        });
        setQuizState(null);
    }
  };

  const handleBackToListFromResults = () => {
    if (resultsState) {
        const sourcePage = resultsState.source;
        setResultsState(null);
        navigateTo(sourcePage);
    }
  };

  const handleGoHomeFromResults = () => {
      setResultsState(null);
      navigateTo('home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'lessons':
        return <LessonsPage navigateBack={() => navigateTo('home')} />;
      case 'questions':
        return <QuestionsPage navigateBack={() => navigateTo('home')} startQuiz={startQuiz} />;
      case 'exams':
        return <ExamsPage navigateBack={() => navigateTo('home')} startQuiz={startQuiz} />;
      case 'flashcards':
        return <FlashcardsPage navigateBack={() => navigateTo('home')} />;
      case 'stats':
        return <StatsPage navigateBack={() => navigateTo('home')} theme={theme} />;
      case 'settings':
        return <SettingsPage navigateBack={() => navigateTo('home')} user={user} setUser={setUser} theme={theme} setTheme={setTheme} />;
      case 'admin':
        // Admin sayfasına sadece admin kullanıcılar erişebilir
        if (!user.isAdmin) {
          // Admin olmayan kullanıcıları home sayfasına yönlendir
          setTimeout(() => navigateTo('home'), 0);
          return <HomePage navigateTo={navigateTo} theme={theme} user={user} />;
        }
        return <AdminPage 
          navigateBack={() => navigateTo('home')} 
          subjects={subjects}
          setSubjects={setSubjects}
          questionsBySubject={questionsBySubject}
          setQuestionsBySubject={setQuestionsBySubject}
          exams={exams}
          setExams={setExams}
          flashcardsBySubject={flashcardsBySubject}
          setFlashcardsBySubject={setFlashcardsBySubject}
        />;
      case 'home':
      default:
        return <HomePage navigateTo={navigateTo} theme={theme} user={user} />;
    }
  };

  if (!isAuthenticated) {
    if (currentPage === 'register') {
      return <RegisterPage 
        onRegisterSuccess={handleLoginSuccess} 
        onShowLogin={() => setCurrentPage('login')} 
      />;
    } else if (currentPage === 'forgot-password') {
      return <ForgotPasswordPage 
        onBackToLogin={() => setCurrentPage('login')} 
      />;
    } else if (currentPage === 'reset-password') {
      return <ResetPasswordPage 
        onPasswordReset={() => setCurrentPage('login')} 
      />;
    } else {
      return <LoginPage 
        onLoginSuccess={handleLoginSuccess} 
        onShowRegister={() => setCurrentPage('register')}
        onShowForgotPassword={() => setCurrentPage('forgot-password')}
      />;
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white font-sans transition-colors duration-300">
      <Header navigateTo={navigateTo} currentPage={currentPage} onLogout={handleLogout} user={user} theme={theme} setTheme={setTheme} />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {quizState ? (
          <QuizSessionPage
            questions={quizState.questions}
            timeLimit={quizState.timeLimit}
            quizName={quizState.name}
            onFinish={handleQuizFinish}
          />
        ) : resultsState ? (
          <ResultsPage
            questions={resultsState.questions}
            userAnswers={resultsState.userAnswers}
            quizName={resultsState.name}
            source={resultsState.source}
            onBackToList={handleBackToListFromResults}
            onGoHome={handleGoHomeFromResults}
          />
        ) : (
          renderPage()
        )}
      </main>
      { !quizState && <Footer /> }
    </div>
  );
};

export default App;