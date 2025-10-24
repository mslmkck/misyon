import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import React from 'react';
import type { Subject, QuizTest, MockExam, FlashcardsBySubject, User, Question } from '../types';
import { SUBJECTS, QUESTIONS_BY_SUBJECT, MOCK_EXAMS, FLASHCARDS_BY_SUBJECT } from '../constants';

interface QuizState {
  questions: Question[];
  timeLimit: number | null;
  name: string;
}

interface ResultsState {
  questions: Question[];
  userAnswers: Record<string, string>;
  name: string;
}

interface AppState {
  // Auth state
  isAuthenticated: boolean;
  user: User;
  
  // Quiz state
  quizState: QuizState | null;
  resultsState: ResultsState | null;
  
  // Progress tracking
  userProgress: {
    completedQuizzes: string[];
    completedLessons: string[];
    quizScores: Record<string, number>;
    totalQuestionsAnswered: number;
    totalCorrectAnswers: number;
    subjectProgress: Record<string, { completed: number; total: number; averageScore: number }>;
  };
  
  // Favorites
  favoriteQuestions: string[];
  
  // Cache for favorites
  _favoriteQuestionsCache?: Question[];
  _favoriteQuestionsCacheKey?: string;
  
  // Data
  subjects: Subject[];
  questionsBySubject: Record<string, QuizTest[]>;
  exams: MockExam[];
  flashcardsBySubject: FlashcardsBySubject;
  
  // Actions
  handleLoginSuccess: () => void;
  handleLogout: () => void;
  setUser: (user: User) => void;
  
  // Progress tracking actions
  updateQuizProgress: (quizId: string, score: number, correctAnswers: number, totalQuestions: number, subjectId?: string) => void;
  updateLessonProgress: (lessonId: string, subjectId: string) => void;
  getOverallProgress: () => number;
  getSubjectProgress: (subjectId: string) => { completed: number; total: number; averageScore: number };
  
  // Favorites actions
  toggleFavoriteQuestion: (questionId: string) => void;
  isFavoriteQuestion: (questionId: string) => boolean;
  getFavoriteQuestions: () => Question[];
  
  // Quiz actions
  startQuiz: (questions: Question[], timeLimit: number | null, name: string) => void;
  handleQuizFinish: (userAnswers: Record<string, string>) => void;
  handleResultsBack: () => void;
  
  // Data actions
  setSubjects: (subjects: Subject[]) => void;
  setQuestionsBySubject: (questions: Record<string, QuizTest[]>) => void;
  setExams: (exams: MockExam[]) => void;
  setFlashcardsBySubject: (flashcards: FlashcardsBySubject) => void;
}

// Helper function to safely parse localStorage data
const safeParseJSON = <T>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage`, error);
    return fallback;
  }
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      user: { name: 'Aday Memur', email: 'aday@prosinav.com' },
      
      quizState: null,
      resultsState: null,
      
      // Initialize user progress
      userProgress: {
        completedQuizzes: [],
        completedLessons: [],
        quizScores: {},
        totalQuestionsAnswered: 0,
        totalCorrectAnswers: 0,
        subjectProgress: {},
      },
      
      // Initialize favorites
      favoriteQuestions: [],
      
      subjects: safeParseJSON('proSınav_subjects', SUBJECTS),
      questionsBySubject: safeParseJSON('proSınav_questions', QUESTIONS_BY_SUBJECT),
      exams: safeParseJSON('proSınav_exams', MOCK_EXAMS),
      flashcardsBySubject: safeParseJSON('proSınav_flashcards', FLASHCARDS_BY_SUBJECT),
      
      // Authentication actions
      handleLoginSuccess: () => {
        set({ isAuthenticated: true });
      },
      
      handleLogout: () => {
        set({ 
          isAuthenticated: false,
          quizState: null,
          resultsState: null
        });
      },
      
      setUser: (user: User) => {
        set({ user });
      },
      
      // Progress tracking actions
      updateQuizProgress: (quizId: string, score: number, correctAnswers: number, totalQuestions: number, subjectId?: string) => {
        const { userProgress } = get();
        const newCompletedQuizzes = [...userProgress.completedQuizzes];
        if (!newCompletedQuizzes.includes(quizId)) {
          newCompletedQuizzes.push(quizId);
        }
        
        const newQuizScores = { ...userProgress.quizScores, [quizId]: score };
        const newTotalQuestionsAnswered = userProgress.totalQuestionsAnswered + totalQuestions;
        const newTotalCorrectAnswers = userProgress.totalCorrectAnswers + correctAnswers;
        
        const newSubjectProgress = { ...userProgress.subjectProgress };
        if (subjectId) {
          const currentSubjectProgress = newSubjectProgress[subjectId] || { completed: 0, total: 0, averageScore: 0 };
          const newCompleted = currentSubjectProgress.completed + 1;
          const newAverageScore = ((currentSubjectProgress.averageScore * currentSubjectProgress.completed) + score) / newCompleted;
          
          newSubjectProgress[subjectId] = {
            completed: newCompleted,
            total: currentSubjectProgress.total + 1,
            averageScore: Math.round(newAverageScore)
          };
        }
        
        set({
          userProgress: {
            ...userProgress,
            completedQuizzes: newCompletedQuizzes,
            quizScores: newQuizScores,
            totalQuestionsAnswered: newTotalQuestionsAnswered,
            totalCorrectAnswers: newTotalCorrectAnswers,
            subjectProgress: newSubjectProgress,
          }
        });
      },
      
      updateLessonProgress: (lessonId: string, subjectId: string) => {
        const { userProgress } = get();
        const newCompletedLessons = [...userProgress.completedLessons];
        if (!newCompletedLessons.includes(lessonId)) {
          newCompletedLessons.push(lessonId);
        }
        
        set({
          userProgress: {
            ...userProgress,
            completedLessons: newCompletedLessons,
          }
        });
      },
      
      getOverallProgress: () => {
        const { userProgress, subjects, questionsBySubject, exams } = get();
        
        // Calculate total available content
        let totalQuizzes = 0;
        let totalLessons = 0;
        
        subjects.forEach(subject => {
          totalLessons += subject.topics?.length || 0;
          totalQuizzes += questionsBySubject[subject.id]?.length || 0;
        });
        totalQuizzes += exams.length;
        
        const totalContent = totalQuizzes + totalLessons;
        const completedContent = userProgress.completedQuizzes.length + userProgress.completedLessons.length;
        
        return totalContent > 0 ? Math.round((completedContent / totalContent) * 100) : 0;
      },
      
      getSubjectProgress: (subjectId: string) => {
        const { userProgress, subjects, questionsBySubject } = get();
        const subject = subjects.find(s => s.id === subjectId);
        
        if (!subject) {
          return { completed: 0, total: 0, averageScore: 0 };
        }
        
        const totalLessons = subject.topics?.length || 0;
        const totalQuizzes = questionsBySubject[subjectId]?.length || 0;
        const totalContent = totalLessons + totalQuizzes;
        
        const completedLessons = userProgress.completedLessons.filter(lessonId => 
          subject.topics?.some(topic => topic.id === lessonId)
        ).length;
        
        const completedQuizzes = userProgress.completedQuizzes.filter(quizId => 
          questionsBySubject[subjectId]?.some(quiz => quiz.id === quizId)
        ).length;
        
        const completed = completedLessons + completedQuizzes;
        
        // Calculate average score for this subject
        const subjectQuizScores = questionsBySubject[subjectId]?.map(quiz => 
          userProgress.quizScores[quiz.id]
        ).filter(score => score !== undefined) || [];
        
        const averageScore = subjectQuizScores.length > 0 
          ? Math.round(subjectQuizScores.reduce((sum, score) => sum + score, 0) / subjectQuizScores.length)
          : 0;
        
        return { completed, total: totalContent, averageScore };
      },
      
      // Favorites actions
      toggleFavoriteQuestion: (questionId: string) => {
        set((state) => ({
          favoriteQuestions: state.favoriteQuestions.includes(questionId)
            ? state.favoriteQuestions.filter(id => id !== questionId)
            : [...state.favoriteQuestions, questionId]
        }));
      },
      
      isFavoriteQuestion: (questionId: string) => {
        const state = get();
        return state.favoriteQuestions.includes(questionId);
      },
      
      getFavoriteQuestions: () => {
        const { favoriteQuestions, questionsBySubject, exams } = get();
        
        // Create a cache key based on favorite questions and data
        const cacheKey = `${favoriteQuestions.join(',')}-${Object.keys(questionsBySubject).length}-${exams.length}`;
        
        // Use a simple cache to prevent infinite loops
        if (!get()._favoriteQuestionsCache || get()._favoriteQuestionsCacheKey !== cacheKey) {
          const allQuestions: Question[] = [];
          
          // Collect all questions from subjects
          Object.values(questionsBySubject).forEach(tests => {
            tests.forEach(test => {
              allQuestions.push(...test.questions);
            });
          });
          
          // Collect all questions from exams
          exams.forEach(exam => {
            allQuestions.push(...exam.questions);
          });
          
          // Filter and cache favorite questions
          const favoriteQuestionsResult = allQuestions.filter(question => favoriteQuestions.includes(question.id));
          
          // Update cache
          set({ 
            _favoriteQuestionsCache: favoriteQuestionsResult,
            _favoriteQuestionsCacheKey: cacheKey
          });
          
          return favoriteQuestionsResult;
        }
        
        return get()._favoriteQuestionsCache || [];
      },
      
      // Quiz actions
      startQuiz: (questions: Question[], timeLimit: number | null, name: string) => {
        set({ 
          quizState: { questions, timeLimit, name },
          resultsState: null
        });
      },
      
      handleQuizFinish: (userAnswers: Record<string, string>) => {
        const { quizState, updateQuizProgress } = get();
        if (quizState) {
          // Calculate score and correct answers
          let correctAnswers = 0;
          const totalQuestions = quizState.questions.length;
          
          quizState.questions.forEach(question => {
            if (userAnswers[question.id] === question.correctAnswer) {
              correctAnswers++;
            }
          });
          
          const score = Math.round((correctAnswers / totalQuestions) * 100);
          
          // Update progress tracking
          updateQuizProgress(
            quizState.name, // Using quiz name as ID
            score,
            correctAnswers,
            totalQuestions,
            quizState.subjectId // Pass subject ID if available
          );
          
          set({
            resultsState: {
              questions: quizState.questions,
              userAnswers: userAnswers,
              name: quizState.name,
            },
            quizState: null
          });
        }
      },
      
      handleResultsBack: () => {
        set({ resultsState: null });
      },
      
      // Data actions with localStorage sync
      setSubjects: (subjects: Subject[]) => {
        set({ subjects });
        localStorage.setItem('proSınav_subjects', JSON.stringify(subjects));
      },
      
      setQuestionsBySubject: (questionsBySubject: Record<string, QuizTest[]>) => {
        set({ questionsBySubject });
        localStorage.setItem('proSınav_questions', JSON.stringify(questionsBySubject));
      },
      
      setExams: (exams: MockExam[]) => {
        set({ exams });
        localStorage.setItem('proSınav_exams', JSON.stringify(exams));
      },
      
      setFlashcardsBySubject: (flashcardsBySubject: FlashcardsBySubject) => {
        set({ flashcardsBySubject });
        localStorage.setItem('proSınav_flashcards', JSON.stringify(flashcardsBySubject));
      },
    }),
    {
      name: 'prosinav-app-store',
      storage: createJSONStorage(() => localStorage),
      // Only persist authentication, user data, and progress
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        userProgress: state.userProgress,
        favoriteQuestions: state.favoriteQuestions,
      }),
    }
  )
);

// Selector hooks for better performance
export const useAuth = () => useAppStore((state) => ({
  isAuthenticated: state.isAuthenticated,
  user: state.user,
  handleLoginSuccess: state.handleLoginSuccess,
  handleLogout: state.handleLogout,
  setUser: state.setUser,
}));

export const useQuiz = () => {
  const quizState = useAppStore((state) => state.quizState);
  const resultsState = useAppStore((state) => state.resultsState);
  const startQuiz = useAppStore((state) => state.startQuiz);
  const handleQuizFinish = useAppStore((state) => state.handleQuizFinish);
  const handleResultsBack = useAppStore((state) => state.handleResultsBack);
  
  return {
    quizState,
    resultsState,
    startQuiz,
    handleQuizFinish,
    handleResultsBack,
  };
};

export const useAppData = () => {
  const store = useAppStore();
  
  // Memoize the data to prevent infinite loops
  const memoizedData = React.useMemo(() => ({
    subjects: store.subjects,
    questionsBySubject: store.questionsBySubject,
    exams: store.exams,
    flashcardsBySubject: store.flashcardsBySubject,
    setSubjects: store.setSubjects,
    setQuestionsBySubject: store.setQuestionsBySubject,
    setExams: store.setExams,
    setFlashcardsBySubject: store.setFlashcardsBySubject,
  }), [
    store.subjects,
    store.questionsBySubject,
    store.exams,
    store.flashcardsBySubject,
    store.setSubjects,
    store.setQuestionsBySubject,
    store.setExams,
    store.setFlashcardsBySubject,
  ]);
  
  return memoizedData;
};

// Progress tracking selector with memoized functions
export const useProgress = () => {
  const store = useAppStore();
  
  // Memoize the progress functions to prevent infinite loops
  const getOverallProgress = React.useMemo(() => store.getOverallProgress, [
    store.userProgress.completedQuizzes.length,
    store.userProgress.completedLessons.length,
    store.userProgress.totalQuestionsAnswered,
    store.userProgress.totalCorrectAnswers,
    store.subjects.length,
    store.questionsBySubject
  ]);
  
  const getSubjectProgress = React.useMemo(() => store.getSubjectProgress, [
    store.userProgress.completedQuizzes.length,
    store.userProgress.completedLessons.length,
    store.userProgress.quizScores,
    store.subjects.length,
    store.questionsBySubject
  ]);
  
  return {
    userProgress: store.userProgress,
    updateQuizProgress: store.updateQuizProgress,
    updateLessonProgress: store.updateLessonProgress,
    getOverallProgress,
    getSubjectProgress,
  };
};

// Favorites selector hook
export const useFavorites = () => {
  const favoriteQuestions = useAppStore((state) => state.favoriteQuestions);
  const toggleFavoriteQuestion = useAppStore((state) => state.toggleFavoriteQuestion);
  const getFavoriteQuestions = useAppStore((state) => state.getFavoriteQuestions);
  
  const isFavoriteQuestion = (questionId: string) => {
    return favoriteQuestions.includes(questionId);
  };
  
  return {
    favoriteQuestions,
    toggleFavoriteQuestion,
    isFavoriteQuestion,
    getFavoriteQuestions,
  };
};