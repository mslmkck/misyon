-- TETİKLEYİCİLER (TRIGGERS) VE FONKSİYONLAR

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