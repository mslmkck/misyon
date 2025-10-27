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