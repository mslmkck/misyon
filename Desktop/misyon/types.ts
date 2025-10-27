// FIX: Import React to provide types like React.ComponentType.
import React from 'react';

export type Page = 'home' | 'lessons' | 'questions' | 'exams' | 'flashcards' | 'stats' | 'admin' | 'settings' | 'login' | 'register' | 'forgot-password' | 'reset-password';
export type Theme = 'light' | 'dark';

export interface User {
  name: string;
  email: string;
  isAdmin?: boolean;
}

export interface Topic {
  id: string;
  title: string;
  content: string;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  topics: Topic[];
}

export interface UserStatsData {
  overallProgress: number;
  lastExamScore: number | null;
  questionsAnswered: number;
  correctAnswers: number;
  subjectPerformance: {
    subject: string;
    score: number;
  }[];
}

export interface Question {
    id: string;
    question: string;
    options: string[];
    answer: string;
    explanation?: string;
}

export interface QuizTest {
    id: string;
    name: string;
    description?: string;
    timeLimit?: number;
    questions: Question[];
}

export interface MockExam {
    id: number | string;
    name: string;
    description?: string;
    duration: number; // in minutes
    questions: Question[];
}

export interface Flashcard {
    id: string;
    front: string;
    back: string;
}

export type FlashcardsBySubject = Record<string, Flashcard[]>;