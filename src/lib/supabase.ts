import { createClient } from '@supabase/supabase-js'

// Supabase URL ve Anon Key - Bu değerleri .env dosyasından alacağız
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL ve Anon Key değerleri .env dosyasında tanımlanmalıdır')
}

// Supabase client oluştur
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database Types
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          first_name: string
          last_name: string
          email: string
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      subjects: {
        Row: {
          id: string
          name: string
          description: string | null
          icon_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      topics: {
        Row: {
          id: string
          subject_id: string
          title: string
          content: string | null
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          subject_id: string
          title: string
          content?: string | null
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          subject_id?: string
          title?: string
          content?: string | null
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      questions: {
        Row: {
          id: string
          subject_id: string
          question: string
          options: string[]
          correct_answer: string
          explanation: string | null
          difficulty_level: number
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          subject_id: string
          question: string
          options: string[]
          correct_answer: string
          explanation?: string | null
          difficulty_level?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          subject_id?: string
          question?: string
          options?: string[]
          correct_answer?: string
          explanation?: string | null
          difficulty_level?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      quiz_sessions: {
        Row: {
          id: string
          user_id: string
          quiz_type: string
          quiz_id: string | null
          subject_id: string | null
          total_questions: number
          correct_answers: number
          wrong_answers: number
          score: number | null
          time_spent: number | null
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          quiz_type: string
          quiz_id?: string | null
          subject_id?: string | null
          total_questions: number
          correct_answers?: number
          wrong_answers?: number
          score?: number | null
          time_spent?: number | null
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          quiz_type?: string
          quiz_id?: string | null
          subject_id?: string | null
          total_questions?: number
          correct_answers?: number
          wrong_answers?: number
          score?: number | null
          time_spent?: number | null
          completed_at?: string | null
          created_at?: string
        }
      }
      user_question_answers: {
        Row: {
          id: string
          user_id: string
          question_id: string
          selected_answer: string
          is_correct: boolean
          answered_at: string
          quiz_session_id: string | null
        }
        Insert: {
          id?: string
          user_id: string
          question_id: string
          selected_answer: string
          is_correct: boolean
          answered_at?: string
          quiz_session_id?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          question_id?: string
          selected_answer?: string
          is_correct?: boolean
          answered_at?: string
          quiz_session_id?: string | null
        }
      }
      user_statistics: {
        Row: {
          id: string
          user_id: string
          total_questions_answered: number
          total_correct_answers: number
          total_wrong_answers: number
          overall_accuracy: number
          total_study_time: number
          last_activity_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          total_questions_answered?: number
          total_correct_answers?: number
          total_wrong_answers?: number
          overall_accuracy?: number
          total_study_time?: number
          last_activity_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          total_questions_answered?: number
          total_correct_answers?: number
          total_wrong_answers?: number
          overall_accuracy?: number
          total_study_time?: number
          last_activity_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      flashcards: {
        Row: {
          id: string
          subject_id: string
          front: string
          back: string
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          subject_id: string
          front: string
          back: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          subject_id?: string
          front?: string
          back?: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

// Auth Helper Functions
export const authHelpers = {
  // Kullanıcı kayıt işlemi
  async signUp(email: string, password: string, firstName: string, lastName: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        }
      }
    })

    // Kayıt başarılıysa user_profiles tablosuna da ekle
    if (data.user && !error) {
      try {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert([{
            id: data.user.id,
            email: email,
            first_name: firstName,
            last_name: lastName,
            full_name: `${firstName} ${lastName}`,
            role: 'user',
            is_admin: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]);

        if (profileError) {
          console.error('Profile creation error:', profileError);
        }
      } catch (profileError) {
        console.error('Profile creation failed:', profileError);
      }
    }

    return { data, error }
  },

  // Kullanıcı giriş işlemi
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  // Kullanıcı çıkış işlemi
  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Şifre sıfırlama
  async resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { data, error }
  },

  // Mevcut kullanıcıyı al
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Kullanıcı profilini al
  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    return { data, error }
  }
}

// Database Operations
export const dbHelpers = {
  // Subjects
  async getSubjects() {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  },

  async createSubject(subject: { name: string; description: string; icon_name: string }) {
    const { data, error } = await supabase
      .from('subjects')
      .insert([subject])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateSubject(id: string, updates: { name?: string; description?: string; icon_name?: string }) {
    const { data, error } = await supabase
      .from('subjects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteSubject(id: string) {
    const { error } = await supabase
      .from('subjects')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Topics
  async getTopics(subjectId?: string) {
    let query = supabase
      .from('topics')
      .select('*')
      .order('order_index');
    
    if (subjectId) {
      query = query.eq('subject_id', subjectId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  },

  async createTopic(topic: { subject_id: string; title: string; content: string; order_index?: number }) {
    const { data, error } = await supabase
      .from('topics')
      .insert([topic])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateTopic(id: string, updates: { title?: string; content?: string; order_index?: number }) {
    const { data, error } = await supabase
      .from('topics')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteTopic(id: string) {
    const { error } = await supabase
      .from('topics')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Questions - Enhanced
  async getQuestions(subjectId?: string, limit?: number) {
    let query = supabase
      .from('questions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (subjectId) {
      query = query.eq('subject_id', subjectId);
    }
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  },

  async createQuestion(question: {
    subject_id: string;
    question: string;
    options: string[];
    correct_answer: string;
    explanation?: string;
    difficulty_level?: number;
  }) {
    const { data, error } = await supabase
      .from('questions')
      .insert([question])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateQuestion(id: string, updates: any) {
    const { data, error } = await supabase
      .from('questions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteQuestion(id: string) {
    const { error } = await supabase
      .from('questions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Quiz Tests
  async getQuizTests(subjectId?: string) {
    let query = supabase
      .from('quiz_tests')
      .select(`
        *,
        quiz_test_questions (
          question_id,
          order_index,
          questions (*)
        )
      `)
      .order('created_at', { ascending: false });
    
    if (subjectId) {
      query = query.eq('subject_id', subjectId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  },

  async createQuizTest(quizTest: {
    subject_id: string;
    name: string;
    description?: string;
    time_limit?: number;
    question_count: number;
  }, questionIds: string[]) {
    // Quiz test'i oluştur
    const { data: quiz, error: quizError } = await supabase
      .from('quiz_tests')
      .insert([quizTest])
      .select()
      .single();
    
    if (quizError) throw quizError;

    // Soruları quiz test'e bağla
    const quizQuestions = questionIds.map((questionId, index) => ({
      quiz_test_id: quiz.id,
      question_id: questionId,
      order_index: index
    }));

    const { error: questionsError } = await supabase
      .from('quiz_test_questions')
      .insert(quizQuestions);
    
    if (questionsError) throw questionsError;
    
    return quiz;
  },

  // Mock Exams
  async getMockExams() {
    const { data, error } = await supabase
      .from('mock_exams')
      .select(`
        *,
        mock_exam_questions (
          question_id,
          order_index,
          questions (*)
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createMockExam(mockExam: {
    name: string;
    description?: string;
    time_limit?: number;
    question_count: number;
  }, questionIds: string[]) {
    // Mock exam'ı oluştur
    const { data: exam, error: examError } = await supabase
      .from('mock_exams')
      .insert([mockExam])
      .select()
      .single();
    
    if (examError) throw examError;

    // Soruları mock exam'a bağla
    const examQuestions = questionIds.map((questionId, index) => ({
      mock_exam_id: exam.id,
      question_id: questionId,
      order_index: index
    }));

    const { error: questionsError } = await supabase
      .from('mock_exam_questions')
      .insert(examQuestions);
    
    if (questionsError) throw questionsError;
    
    return exam;
  },

  // Flashcards - Enhanced
  async getFlashcards(subjectId?: string) {
    let query = supabase
      .from('flashcards')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (subjectId) {
      query = query.eq('subject_id', subjectId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  },

  async createFlashcard(flashcard: {
    subject_id: string;
    front: string;
    back: string;
  }) {
    const { data, error } = await supabase
      .from('flashcards')
      .insert([flashcard])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateFlashcard(id: string, updates: { front?: string; back?: string }) {
    const { data, error } = await supabase
      .from('flashcards')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteFlashcard(id: string) {
    const { error } = await supabase
      .from('flashcards')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Quiz Sessions & Statistics - Enhanced
  async createQuizSession(session: Database['public']['Tables']['quiz_sessions']['Insert']) {
    const { data, error } = await supabase
      .from('quiz_sessions')
      .insert([session])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateQuizSession(id: string, updates: {
    correct_answers?: number;
    wrong_answers?: number;
    score?: number;
    time_spent?: number;
    completed_at?: string;
  }) {
    const { data, error } = await supabase
      .from('quiz_sessions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async saveQuestionAnswer(answer: Database['public']['Tables']['user_question_answers']['Insert']) {
    const { data, error } = await supabase
      .from('user_question_answers')
      .insert([answer])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUserStatistics(userId?: string) {
    let query = supabase
      .from('user_statistics')
      .select('*');
    
    if (userId) {
      query = query.eq('user_id', userId);
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        query = query.eq('user_id', user.id);
      }
    }
    
    const { data, error } = await query.single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
    return data;
  },

  async getSubjectStatistics(subjectId?: string, userId?: string) {
    let query = supabase
      .from('subject_statistics')
      .select('*, subjects(name)');
    
    if (userId) {
      query = query.eq('user_id', userId);
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        query = query.eq('user_id', user.id);
      }
    }
    
    if (subjectId) {
      query = query.eq('subject_id', subjectId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  },

  // Announcements
  async getAnnouncements() {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getAllAnnouncements() {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createAnnouncement(announcement: { title: string; content: string; is_active?: boolean }) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Kullanıcı oturumu bulunamadı');

    const { data, error } = await supabase
      .from('announcements')
      .insert([{
        ...announcement,
        created_by: user.id
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateAnnouncement(id: string, updates: { title?: string; content?: string; is_active?: boolean }) {
    const { data, error } = await supabase
      .from('announcements')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteAnnouncement(id: string) {
    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
}