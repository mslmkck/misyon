-- RLS POLİTİKALARINI DÜZELT
-- Anonim kullanıcıların da verileri görebilmesi için

-- Subjects için düzeltme
DROP POLICY IF EXISTS "Allow all for authenticated users" ON public.subjects;
CREATE POLICY "Allow read for everyone" ON public.subjects
    FOR SELECT USING (true);
CREATE POLICY "Allow write for authenticated users" ON public.subjects
    FOR ALL USING (auth.role() = 'authenticated');

-- Topics için düzeltme
DROP POLICY IF EXISTS "Allow all for authenticated users" ON public.topics;
CREATE POLICY "Allow read for everyone" ON public.topics
    FOR SELECT USING (true);
CREATE POLICY "Allow write for authenticated users" ON public.topics
    FOR ALL USING (auth.role() = 'authenticated');

-- Questions için düzeltme
DROP POLICY IF EXISTS "Allow all for authenticated users" ON public.questions;
CREATE POLICY "Allow read for everyone" ON public.questions
    FOR SELECT USING (true);
CREATE POLICY "Allow write for authenticated users" ON public.questions
    FOR ALL USING (auth.role() = 'authenticated');

-- Flashcards için düzeltme
DROP POLICY IF EXISTS "Allow all for authenticated users" ON public.flashcards;
CREATE POLICY "Allow read for everyone" ON public.flashcards
    FOR SELECT USING (true);
CREATE POLICY "Allow write for authenticated users" ON public.flashcards
    FOR ALL USING (auth.role() = 'authenticated');

-- Mock Exams için düzeltme
DROP POLICY IF EXISTS "Allow all for authenticated users" ON public.mock_exams;
CREATE POLICY "Allow read for everyone" ON public.mock_exams
    FOR SELECT USING (true);
CREATE POLICY "Allow write for authenticated users" ON public.mock_exams
    FOR ALL USING (auth.role() = 'authenticated');

-- Quiz Tests için düzeltme
DROP POLICY IF EXISTS "Allow all for authenticated users" ON public.quiz_tests;
CREATE POLICY "Allow read for everyone" ON public.quiz_tests
    FOR SELECT USING (true);
CREATE POLICY "Allow write for authenticated users" ON public.quiz_tests
    FOR ALL USING (auth.role() = 'authenticated');

-- User Profiles için basit politika
DROP POLICY IF EXISTS "Allow all for authenticated users" ON public.user_profiles;
CREATE POLICY "Users can manage own profile" ON public.user_profiles
    FOR ALL USING (auth.uid() = id);

-- User specific tablolar için
DROP POLICY IF EXISTS "Allow all for authenticated users" ON public.user_question_answers;
CREATE POLICY "Users can manage own answers" ON public.user_question_answers
    FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow all for authenticated users" ON public.quiz_sessions;
CREATE POLICY "Users can manage own sessions" ON public.quiz_sessions
    FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow all for authenticated users" ON public.user_statistics;
CREATE POLICY "Users can manage own statistics" ON public.user_statistics
    FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow all for authenticated users" ON public.subject_statistics;
CREATE POLICY "Users can manage own subject statistics" ON public.subject_statistics
    FOR ALL USING (auth.uid() = user_id);