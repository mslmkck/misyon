-- ROW LEVEL SECURITY (RLS) POLİTİKALARI (Güvenli Versiyon)

-- User Profiles için RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Mevcut politikaları temizle
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;

-- Basit politikalar oluştur (sonsuz döngü olmadan)
CREATE POLICY "Allow all for authenticated users" ON public.user_profiles
    FOR ALL USING (auth.role() = 'authenticated');

-- Subjects için RLS
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Everyone can view subjects" ON public.subjects;
DROP POLICY IF EXISTS "Only admins can modify subjects" ON public.subjects;

CREATE POLICY "Allow all for authenticated users" ON public.subjects
    FOR ALL USING (auth.role() = 'authenticated');

-- Topics için RLS
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Everyone can view topics" ON public.topics;
DROP POLICY IF EXISTS "Only admins can modify topics" ON public.topics;

CREATE POLICY "Allow all for authenticated users" ON public.topics
    FOR ALL USING (auth.role() = 'authenticated');

-- Questions için RLS
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Everyone can view questions" ON public.questions;
DROP POLICY IF EXISTS "Only admins can modify questions" ON public.questions;

CREATE POLICY "Allow all for authenticated users" ON public.questions
    FOR ALL USING (auth.role() = 'authenticated');

-- Quiz Tests için RLS
ALTER TABLE public.quiz_tests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Everyone can view quiz tests" ON public.quiz_tests;
DROP POLICY IF EXISTS "Only admins can modify quiz tests" ON public.quiz_tests;

CREATE POLICY "Allow all for authenticated users" ON public.quiz_tests
    FOR ALL USING (auth.role() = 'authenticated');

-- Mock Exams için RLS
ALTER TABLE public.mock_exams ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Everyone can view mock exams" ON public.mock_exams;
DROP POLICY IF EXISTS "Only admins can modify mock exams" ON public.mock_exams;

CREATE POLICY "Allow all for authenticated users" ON public.mock_exams
    FOR ALL USING (auth.role() = 'authenticated');

-- Flashcards için RLS
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Everyone can view flashcards" ON public.flashcards;
DROP POLICY IF EXISTS "Only admins can modify flashcards" ON public.flashcards;

CREATE POLICY "Allow all for authenticated users" ON public.flashcards
    FOR ALL USING (auth.role() = 'authenticated');

-- User Question Answers için RLS
ALTER TABLE public.user_question_answers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own answers" ON public.user_question_answers;
DROP POLICY IF EXISTS "Users can insert own answers" ON public.user_question_answers;
DROP POLICY IF EXISTS "Admins can view all answers" ON public.user_question_answers;

CREATE POLICY "Allow all for authenticated users" ON public.user_question_answers
    FOR ALL USING (auth.role() = 'authenticated');

-- Quiz Sessions için RLS
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own sessions" ON public.quiz_sessions;
DROP POLICY IF EXISTS "Users can insert own sessions" ON public.quiz_sessions;
DROP POLICY IF EXISTS "Users can update own sessions" ON public.quiz_sessions;

CREATE POLICY "Allow all for authenticated users" ON public.quiz_sessions
    FOR ALL USING (auth.role() = 'authenticated');

-- User Statistics için RLS
ALTER TABLE public.user_statistics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own statistics" ON public.user_statistics;
DROP POLICY IF EXISTS "Users can update own statistics" ON public.user_statistics;

CREATE POLICY "Allow all for authenticated users" ON public.user_statistics
    FOR ALL USING (auth.role() = 'authenticated');

-- Subject Statistics için RLS
ALTER TABLE public.subject_statistics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own subject statistics" ON public.subject_statistics;
DROP POLICY IF EXISTS "Users can update own subject statistics" ON public.subject_statistics;

CREATE POLICY "Allow all for authenticated users" ON public.subject_statistics
    FOR ALL USING (auth.role() = 'authenticated');