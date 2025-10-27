-- Supabase Veritabanı Şeması
-- Komiser Yardımcılığı Hazırlık Platformu

-- 1. KULLANICILAR TABLOSU (auth.users tablosuna ek profil bilgileri)
CREATE TABLE public.user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. KONULAR TABLOSU
CREATE TABLE public.subjects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. KONU BAŞLIKLARI TABLOSU
CREATE TABLE public.topics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. SORULAR TABLOSU
CREATE TABLE public.questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options JSONB NOT NULL, -- ["A şıkkı", "B şıkkı", "C şıkkı", "D şıkkı"]
    correct_answer TEXT NOT NULL,
    explanation TEXT,
    difficulty_level INTEGER DEFAULT 1, -- 1: Kolay, 2: Orta, 3: Zor
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. SORU TESTLERI TABLOSU
CREATE TABLE public.quiz_tests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. TEST-SORU İLİŞKİSİ TABLOSU
CREATE TABLE public.quiz_test_questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    quiz_test_id UUID REFERENCES public.quiz_tests(id) ON DELETE CASCADE,
    question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. DENEME SINAVLARI TABLOSU
CREATE TABLE public.mock_exams (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    duration INTEGER NOT NULL, -- dakika cinsinden
    total_questions INTEGER DEFAULT 0,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. DENEME SINAVI-SORU İLİŞKİSİ TABLOSU
CREATE TABLE public.mock_exam_questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    mock_exam_id UUID REFERENCES public.mock_exams(id) ON DELETE CASCADE,
    question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. BİLGİ KARTLARI TABLOSU
CREATE TABLE public.flashcards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    front TEXT NOT NULL,
    back TEXT NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. KULLANICI SORU CEVAPLARI TABLOSU
CREATE TABLE public.user_question_answers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
    selected_answer TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    quiz_session_id UUID, -- Hangi quiz oturumunda cevaplanmış
    UNIQUE(user_id, question_id, quiz_session_id)
);

-- 11. QUIZ OTURUMLARI TABLOSU
CREATE TABLE public.quiz_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    quiz_type TEXT NOT NULL, -- 'quiz_test', 'mock_exam', 'subject_practice'
    quiz_id UUID, -- quiz_test_id veya mock_exam_id
    subject_id UUID REFERENCES public.subjects(id),
    total_questions INTEGER NOT NULL,
    correct_answers INTEGER DEFAULT 0,
    wrong_answers INTEGER DEFAULT 0,
    score DECIMAL(5,2), -- Yüzde olarak
    time_spent INTEGER, -- saniye cinsinden
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. KULLANICI İSTATİSTİKLERİ TABLOSU
CREATE TABLE public.user_statistics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    total_questions_answered INTEGER DEFAULT 0,
    total_correct_answers INTEGER DEFAULT 0,
    total_wrong_answers INTEGER DEFAULT 0,
    overall_accuracy DECIMAL(5,2) DEFAULT 0.00,
    total_study_time INTEGER DEFAULT 0, -- dakika cinsinden
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. KONU BAZLI İSTATİSTİKLER TABLOSU
CREATE TABLE public.subject_statistics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    questions_answered INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    wrong_answers INTEGER DEFAULT 0,
    accuracy DECIMAL(5,2) DEFAULT 0.00,
    last_studied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, subject_id)
);

-- ROW LEVEL SECURITY (RLS) POLİTİKALARI

-- User Profiles için RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.user_profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- Subjects için RLS
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view subjects" ON public.subjects
    FOR SELECT USING (true);

CREATE POLICY "Only admins can modify subjects" ON public.subjects
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- Topics için RLS
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view topics" ON public.topics
    FOR SELECT USING (true);

CREATE POLICY "Only admins can modify topics" ON public.topics
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- Questions için RLS
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view questions" ON public.questions
    FOR SELECT USING (true);

CREATE POLICY "Only admins can modify questions" ON public.questions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- Quiz Tests için RLS
ALTER TABLE public.quiz_tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view quiz tests" ON public.quiz_tests
    FOR SELECT USING (true);

CREATE POLICY "Only admins can modify quiz tests" ON public.quiz_tests
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- Mock Exams için RLS
ALTER TABLE public.mock_exams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view mock exams" ON public.mock_exams
    FOR SELECT USING (true);

CREATE POLICY "Only admins can modify mock exams" ON public.mock_exams
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- Flashcards için RLS
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view flashcards" ON public.flashcards
    FOR SELECT USING (true);

CREATE POLICY "Only admins can modify flashcards" ON public.flashcards
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- User Question Answers için RLS
ALTER TABLE public.user_question_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own answers" ON public.user_question_answers
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own answers" ON public.user_question_answers
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all answers" ON public.user_question_answers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- Quiz Sessions için RLS
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions" ON public.quiz_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" ON public.quiz_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" ON public.quiz_sessions
    FOR UPDATE USING (auth.uid() = user_id);

-- User Statistics için RLS
ALTER TABLE public.user_statistics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own statistics" ON public.user_statistics
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own statistics" ON public.user_statistics
    FOR ALL USING (auth.uid() = user_id);

-- Subject Statistics için RLS
ALTER TABLE public.subject_statistics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subject statistics" ON public.subject_statistics
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subject statistics" ON public.subject_statistics
    FOR ALL USING (auth.uid() = user_id);

-- TETİKLEYİCİLER (TRIGGERS)

-- User profile oluşturma tetikleyicisi
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, first_name, last_name, email, is_admin)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
        NEW.email,
        CASE WHEN NEW.email = 'admin@prosinav.com' THEN true ELSE false END
    );
    
    -- Kullanıcı istatistikleri tablosunu başlat
    INSERT INTO public.user_statistics (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Yeni kullanıcı kaydında tetikleyici
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at alanlarını otomatik güncelleme fonksiyonu
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Updated_at tetikleyicileri
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.subjects
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.topics
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.questions
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.quiz_tests
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.mock_exams
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.flashcards
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.user_statistics
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.subject_statistics
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- İSTATİSTİK GÜNCELLEME FONKSİYONLARI

-- Kullanıcı istatistiklerini güncelleme fonksiyonu
CREATE OR REPLACE FUNCTION public.update_user_statistics()
RETURNS TRIGGER AS $$
BEGIN
    -- Genel istatistikleri güncelle
    UPDATE public.user_statistics 
    SET 
        total_questions_answered = (
            SELECT COUNT(*) FROM public.user_question_answers 
            WHERE user_id = NEW.user_id
        ),
        total_correct_answers = (
            SELECT COUNT(*) FROM public.user_question_answers 
            WHERE user_id = NEW.user_id AND is_correct = true
        ),
        total_wrong_answers = (
            SELECT COUNT(*) FROM public.user_question_answers 
            WHERE user_id = NEW.user_id AND is_correct = false
        ),
        last_activity_at = NOW(),
        updated_at = NOW()
    WHERE user_id = NEW.user_id;
    
    -- Genel doğruluk oranını hesapla
    UPDATE public.user_statistics 
    SET overall_accuracy = CASE 
        WHEN total_questions_answered > 0 
        THEN (total_correct_answers::DECIMAL / total_questions_answered::DECIMAL) * 100 
        ELSE 0 
    END
    WHERE user_id = NEW.user_id;
    
    -- Konu bazlı istatistikleri güncelle
    INSERT INTO public.subject_statistics (user_id, subject_id, questions_answered, correct_answers, wrong_answers)
    SELECT 
        NEW.user_id,
        q.subject_id,
        COUNT(*),
        SUM(CASE WHEN uqa.is_correct THEN 1 ELSE 0 END),
        SUM(CASE WHEN NOT uqa.is_correct THEN 1 ELSE 0 END)
    FROM public.user_question_answers uqa
    JOIN public.questions q ON q.id = uqa.question_id
    WHERE uqa.user_id = NEW.user_id AND q.subject_id IS NOT NULL
    GROUP BY q.subject_id
    ON CONFLICT (user_id, subject_id) 
    DO UPDATE SET
        questions_answered = EXCLUDED.questions_answered,
        correct_answers = EXCLUDED.correct_answers,
        wrong_answers = EXCLUDED.wrong_answers,
        accuracy = CASE 
            WHEN EXCLUDED.questions_answered > 0 
            THEN (EXCLUDED.correct_answers::DECIMAL / EXCLUDED.questions_answered::DECIMAL) * 100 
            ELSE 0 
        END,
        last_studied_at = NOW(),
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Soru cevaplandığında istatistikleri güncelle
CREATE TRIGGER update_statistics_on_answer
    AFTER INSERT ON public.user_question_answers
    FOR EACH ROW EXECUTE FUNCTION public.update_user_statistics();

-- ÖRNEK VERİLER

-- Konuları ekle
INSERT INTO public.subjects (id, name, description, icon_name) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Anayasa Hukuku', 'Temel anayasal kavramlar, devlet yapısı ve temel haklar.', 'BookOpenIcon'),
('550e8400-e29b-41d4-a716-446655440002', 'İdare Hukuku', 'İdarenin yapısı, işleyişi ve idari işlemler.', 'BookOpenIcon'),
('550e8400-e29b-41d4-a716-446655440003', 'Ceza Hukuku', 'Suç ve ceza kavramları, genel ve özel hükümler.', 'BookOpenIcon'),
('550e8400-e29b-41d4-a716-446655440004', 'Ceza Muhakemesi Hukuku', 'Soruşturma, kovuşturma ve yargılama süreçleri.', 'BookOpenIcon'),
('550e8400-e29b-41d4-a716-446655440005', 'Polis Mevzuatı', 'Polisin görev, yetki ve sorumlulukları.', 'ClipboardListIcon'),
('550e8400-e29b-41d4-a716-446655440006', 'Atatürk İlkeleri ve İnkılap Tarihi', 'Türkiye Cumhuriyeti''nin kuruluş ve gelişim süreci.', 'BookOpenIcon'),
('550e8400-e29b-41d4-a716-446655440007', 'İnsan Hakları', 'Evrensel insan hakları beyannamesi ve sözleşmeler.', 'BookOpenIcon'),
('550e8400-e29b-41d4-a716-446655440008', 'Genel Kültür', 'Tarih, coğrafya, vatandaşlık ve güncel konular.', 'QuestionMarkCircleIcon');

-- Anayasa Hukuku konularını ekle
INSERT INTO public.topics (subject_id, title, content, order_index) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Anayasal Gelişmeler', 'Osmanlı''dan günümüze anayasal gelişmeler, Sened-i İttifak, Tanzimat Fermanı, Islahat Fermanı, Kanun-i Esasi ve Cumhuriyet dönemi anayasaları hakkında detaylı özet.', 1),
('550e8400-e29b-41d4-a716-446655440001', 'Yürütme', 'Cumhurbaşkanı, görev ve yetkileri, bakanlar ve merkezi idare teşkilatı. Yürütme organının işleyişi ve yapısı.', 2),
('550e8400-e29b-41d4-a716-446655440001', 'Yargı', 'Anayasa Mahkemesi, Yargıtay, Danıştay gibi yüksek mahkemeler, HSK ve Türk yargı sisteminin temel ilkeleri.', 3),
('550e8400-e29b-41d4-a716-446655440001', 'Seçimler', 'Seçimlerin genel ilkeleri, milletvekili seçimi, Cumhurbaşkanı seçimi ve seçim sistemleri hakkında temel bilgiler.', 4);