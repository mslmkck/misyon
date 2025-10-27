-- Mevcut tabloları temizle (dikkatli kullanın!)
-- Bu komut tüm verileri siler!

-- Önce bağımlılıkları olan tabloları sil
DROP TABLE IF EXISTS public.subject_statistics CASCADE;
DROP TABLE IF EXISTS public.user_statistics CASCADE;
DROP TABLE IF EXISTS public.quiz_sessions CASCADE;
DROP TABLE IF EXISTS public.user_question_answers CASCADE;
DROP TABLE IF EXISTS public.flashcards CASCADE;
DROP TABLE IF EXISTS public.mock_exam_questions CASCADE;
DROP TABLE IF EXISTS public.mock_exams CASCADE;
DROP TABLE IF EXISTS public.quiz_test_questions CASCADE;
DROP TABLE IF EXISTS public.quiz_tests CASCADE;
DROP TABLE IF EXISTS public.questions CASCADE;
DROP TABLE IF EXISTS public.topics CASCADE;
DROP TABLE IF EXISTS public.subjects CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;

-- Fonksiyonları da temizle
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.update_user_statistics() CASCADE;