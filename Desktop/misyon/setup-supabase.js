import { createClient } from '@supabase/supabase-js';

// Yeni Supabase client oluştur (service role key ile)
const supabase = createClient(
  'https://qdyezbtbmkwibedukdml.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkeWV6YnRibWt3aWJlZHVrZG1sIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTUyMDMzOSwiZXhwIjoyMDc3MDk2MzM5fQ.GZmVdOFzmJB4iFfsbZ730t4JDLZ07vYG6YL9O6cFt7k',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function setupDatabase() {
  try {
    console.log('🚀 Veritabanı şeması oluşturuluyor...');

    // Tabloları oluştur
    const { error: schemaError } = await supabase.rpc('exec_sql', {
      sql: `
        -- 1. KULLANICILAR TABLOSU (auth.users tablosuna ek profil bilgileri)
        CREATE TABLE IF NOT EXISTS public.user_profiles (
            id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            is_admin BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- 2. KONULAR TABLOSU
        CREATE TABLE IF NOT EXISTS public.subjects (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            icon_name TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- 3. KONU BAŞLIKLARI TABLOSU
        CREATE TABLE IF NOT EXISTS public.topics (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
            title TEXT NOT NULL,
            content TEXT,
            order_index INTEGER DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- 4. DUYURULAR TABLOSU
        CREATE TABLE IF NOT EXISTS public.announcements (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            is_active BOOLEAN DEFAULT true,
            created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- 4. SORULAR TABLOSU
        CREATE TABLE IF NOT EXISTS public.questions (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
            question TEXT NOT NULL,
            options JSONB NOT NULL,
            correct_answer TEXT NOT NULL,
            explanation TEXT,
            difficulty INTEGER DEFAULT 1 CHECK (difficulty BETWEEN 1 AND 5),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- 5. TEST GRUPLARI TABLOSU
        CREATE TABLE IF NOT EXISTS public.quiz_tests (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
            name TEXT NOT NULL,
            description TEXT,
            question_count INTEGER DEFAULT 10,
            time_limit INTEGER DEFAULT 600,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- 6. DENEME SINAVLARI TABLOSU
        CREATE TABLE IF NOT EXISTS public.mock_exams (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            total_questions INTEGER DEFAULT 100,
            time_limit INTEGER DEFAULT 7200,
            subjects JSONB,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- 7. BİLGİ KARTLARI TABLOSU
        CREATE TABLE IF NOT EXISTS public.flashcards (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
            front TEXT NOT NULL,
            back TEXT NOT NULL,
            created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- 8. KULLANICI SORU CEVAPLARI TABLOSU
        CREATE TABLE IF NOT EXISTS public.user_question_answers (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
            selected_answer TEXT NOT NULL,
            is_correct BOOLEAN NOT NULL,
            answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- 9. TEST OTURUMLARI TABLOSU
        CREATE TABLE IF NOT EXISTS public.quiz_sessions (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            quiz_test_id UUID REFERENCES public.quiz_tests(id) ON DELETE CASCADE,
            score INTEGER DEFAULT 0,
            total_questions INTEGER NOT NULL,
            correct_answers INTEGER DEFAULT 0,
            wrong_answers INTEGER DEFAULT 0,
            time_spent INTEGER DEFAULT 0,
            completed_at TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- 10. KULLANICI İSTATİSTİKLERİ TABLOSU
        CREATE TABLE IF NOT EXISTS public.user_statistics (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
            total_questions_answered INTEGER DEFAULT 0,
            total_correct_answers INTEGER DEFAULT 0,
            total_wrong_answers INTEGER DEFAULT 0,
            total_time_spent INTEGER DEFAULT 0,
            average_score DECIMAL(5,2) DEFAULT 0,
            last_activity_at TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- 11. KONU BAZLI İSTATİSTİKLER TABLOSU
        CREATE TABLE IF NOT EXISTS public.subject_statistics (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
            questions_answered INTEGER DEFAULT 0,
            correct_answers INTEGER DEFAULT 0,
            wrong_answers INTEGER DEFAULT 0,
            accuracy DECIMAL(5,2) DEFAULT 0,
            last_studied_at TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(user_id, subject_id)
        );
      `
    });

    if (schemaError) {
      console.error('❌ Şema oluşturma hatası:', schemaError);
      return;
    }

    console.log('✅ Tablolar başarıyla oluşturuldu!');

    // RLS politikalarını etkinleştir
    console.log('🔒 RLS politikaları uygulanıyor...');
    
    const { error: rlsError } = await supabase.rpc('exec_sql', {
      sql: `
        -- RLS'yi etkinleştir
        ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.quiz_tests ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.mock_exams ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.user_question_answers ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.user_statistics ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.subject_statistics ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

        -- Genel okuma politikaları
        CREATE POLICY IF NOT EXISTS "Everyone can view subjects" ON public.subjects FOR SELECT USING (true);
        CREATE POLICY IF NOT EXISTS "Everyone can view topics" ON public.topics FOR SELECT USING (true);
        CREATE POLICY IF NOT EXISTS "Everyone can view questions" ON public.questions FOR SELECT USING (true);
        CREATE POLICY IF NOT EXISTS "Everyone can view quiz tests" ON public.quiz_tests FOR SELECT USING (true);
        CREATE POLICY IF NOT EXISTS "Everyone can view mock exams" ON public.mock_exams FOR SELECT USING (true);
        CREATE POLICY IF NOT EXISTS "Everyone can view flashcards" ON public.flashcards FOR SELECT USING (true);
        CREATE POLICY IF NOT EXISTS "Everyone can view active announcements" ON public.announcements FOR SELECT USING (is_active = true);

        -- Admin politikaları
        CREATE POLICY IF NOT EXISTS "Only admins can modify subjects" ON public.subjects FOR ALL USING (
            EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND is_admin = true)
        );
        CREATE POLICY IF NOT EXISTS "Only admins can modify topics" ON public.topics FOR ALL USING (
            EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND is_admin = true)
        );
        CREATE POLICY IF NOT EXISTS "Only admins can modify questions" ON public.questions FOR ALL USING (
            EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND is_admin = true)
        );
        CREATE POLICY IF NOT EXISTS "Only admins can modify quiz tests" ON public.quiz_tests FOR ALL USING (
            EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND is_admin = true)
        );
        CREATE POLICY IF NOT EXISTS "Only admins can modify mock exams" ON public.mock_exams FOR ALL USING (
            EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND is_admin = true)
        );
        CREATE POLICY IF NOT EXISTS "Only admins can modify flashcards" ON public.flashcards FOR ALL USING (
            EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND is_admin = true)
        );
        CREATE POLICY IF NOT EXISTS "Only admins can manage announcements" ON public.announcements FOR ALL USING (
            EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND is_admin = true)
        );

        -- Kullanıcı politikaları
        CREATE POLICY IF NOT EXISTS "Users can view own profile" ON public.user_profiles FOR SELECT USING (auth.uid() = id);
        CREATE POLICY IF NOT EXISTS "Users can update own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = id);
        CREATE POLICY IF NOT EXISTS "Users can view own answers" ON public.user_question_answers FOR SELECT USING (auth.uid() = user_id);
        CREATE POLICY IF NOT EXISTS "Users can insert own answers" ON public.user_question_answers FOR INSERT WITH CHECK (auth.uid() = user_id);
        CREATE POLICY IF NOT EXISTS "Users can view own sessions" ON public.quiz_sessions FOR SELECT USING (auth.uid() = user_id);
        CREATE POLICY IF NOT EXISTS "Users can insert own sessions" ON public.quiz_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
        CREATE POLICY IF NOT EXISTS "Users can update own sessions" ON public.quiz_sessions FOR UPDATE USING (auth.uid() = user_id);
        CREATE POLICY IF NOT EXISTS "Users can view own statistics" ON public.user_statistics FOR SELECT USING (auth.uid() = user_id);
        CREATE POLICY IF NOT EXISTS "Users can update own statistics" ON public.user_statistics FOR ALL USING (auth.uid() = user_id);
        CREATE POLICY IF NOT EXISTS "Users can view own subject statistics" ON public.subject_statistics FOR SELECT USING (auth.uid() = user_id);
        CREATE POLICY IF NOT EXISTS "Users can update own subject statistics" ON public.subject_statistics FOR ALL USING (auth.uid() = user_id);
      `
    });

    if (rlsError) {
      console.error('❌ RLS politika hatası:', rlsError);
      return;
    }

    console.log('✅ RLS politikaları başarıyla uygulandı!');

    // Örnek verileri ekle
    console.log('📝 Örnek veriler ekleniyor...');
    
    const { error: dataError } = await supabase.rpc('exec_sql', {
      sql: `
        -- Konuları ekle
        INSERT INTO public.subjects (id, name, description, icon_name) VALUES
        ('550e8400-e29b-41d4-a716-446655440001', 'Anayasa Hukuku', 'Temel anayasal kavramlar, devlet yapısı ve temel haklar.', 'BookOpenIcon'),
        ('550e8400-e29b-41d4-a716-446655440002', 'İdare Hukuku', 'İdarenin yapısı, işleyişi ve idari işlemler.', 'BookOpenIcon'),
        ('550e8400-e29b-41d4-a716-446655440003', 'Ceza Hukuku', 'Suç ve ceza kavramları, genel ve özel hükümler.', 'BookOpenIcon'),
        ('550e8400-e29b-41d4-a716-446655440004', 'Ceza Muhakemesi Hukuku', 'Soruşturma, kovuşturma ve yargılama süreçleri.', 'BookOpenIcon'),
        ('550e8400-e29b-41d4-a716-446655440005', 'Genel Kültür', 'Tarih, coğrafya, edebiyat ve genel bilgiler.', 'BookOpenIcon')
        ON CONFLICT (id) DO NOTHING;
      `
    });

    if (dataError) {
      console.error('❌ Örnek veri ekleme hatası:', dataError);
      return;
    }

    console.log('✅ Örnek veriler başarıyla eklendi!');
    console.log('🎉 Supabase veritabanı kurulumu tamamlandı!');

  } catch (error) {
    console.error('❌ Genel hata:', error);
  }
}

// Kurulumu başlat
setupDatabase();