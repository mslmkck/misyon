import { createClient } from '@supabase/supabase-js';

// Supabase client oluştur (service role key ile)
const supabase = createClient(
  'https://mexzmpmexxaauxpadkud.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1leHptcG1leHhhYXV4cGFka3VkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTQ5NTU0NiwiZXhwIjoyMDc3MDcxNTQ2fQ.qzZJwMg_sDn5dBm_yrixhZNzW6k6HgOi7fKJWnTuids',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function setupDatabase() {
  try {
    console.log('Veritabanı şeması oluşturuluyor...');

    // Tabloları oluştur
    const createTablesSQL = `
      -- User profiles tablosu
      CREATE TABLE IF NOT EXISTS user_profiles (
        id UUID REFERENCES auth.users(id) PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT,
        role TEXT DEFAULT 'student' CHECK (role IN ('student', 'admin')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Subjects tablosu
      CREATE TABLE IF NOT EXISTS subjects (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        color TEXT DEFAULT '#3B82F6',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Topics tablosu
      CREATE TABLE IF NOT EXISTS topics (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        description TEXT,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Questions tablosu
      CREATE TABLE IF NOT EXISTS questions (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
        question_text TEXT NOT NULL,
        options JSONB NOT NULL,
        correct_answer INTEGER NOT NULL,
        explanation TEXT,
        difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Quiz tests tablosu
      CREATE TABLE IF NOT EXISTS quiz_tests (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        description TEXT,
        time_limit INTEGER DEFAULT 60,
        question_count INTEGER DEFAULT 10,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Mock exams tablosu
      CREATE TABLE IF NOT EXISTS mock_exams (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        duration INTEGER DEFAULT 120,
        question_count INTEGER DEFAULT 50,
        subjects JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Flashcards tablosu
      CREATE TABLE IF NOT EXISTS flashcards (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
        front TEXT NOT NULL,
        back TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- User progress tablosu
      CREATE TABLE IF NOT EXISTS user_progress (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
        topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
        completed_questions INTEGER DEFAULT 0,
        total_questions INTEGER DEFAULT 0,
        accuracy_rate DECIMAL(5,2) DEFAULT 0.00,
        last_studied TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(user_id, subject_id, topic_id)
      );

      -- RLS politikaları
      ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
      ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
      ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
      ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
      ALTER TABLE quiz_tests ENABLE ROW LEVEL SECURITY;
      ALTER TABLE mock_exams ENABLE ROW LEVEL SECURITY;
      ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
      ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

      -- User profiles politikaları
      CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
      CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
      CREATE POLICY "Admins can view all profiles" ON user_profiles FOR SELECT USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
      );

      -- Public read politikaları
      CREATE POLICY "Anyone can read subjects" ON subjects FOR SELECT USING (true);
      CREATE POLICY "Anyone can read topics" ON topics FOR SELECT USING (true);
      CREATE POLICY "Anyone can read questions" ON questions FOR SELECT USING (true);
      CREATE POLICY "Anyone can read quiz_tests" ON quiz_tests FOR SELECT USING (true);
      CREATE POLICY "Anyone can read mock_exams" ON mock_exams FOR SELECT USING (true);
      CREATE POLICY "Anyone can read flashcards" ON flashcards FOR SELECT USING (true);

      -- User progress politikaları
      CREATE POLICY "Users can view own progress" ON user_progress FOR SELECT USING (auth.uid() = user_id);
      CREATE POLICY "Users can insert own progress" ON user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
      CREATE POLICY "Users can update own progress" ON user_progress FOR UPDATE USING (auth.uid() = user_id);

      -- Admin politikaları
      CREATE POLICY "Admins can manage subjects" ON subjects FOR ALL USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
      );
      CREATE POLICY "Admins can manage topics" ON topics FOR ALL USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
      );
      CREATE POLICY "Admins can manage questions" ON questions FOR ALL USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
      );
      CREATE POLICY "Admins can manage quiz_tests" ON quiz_tests FOR ALL USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
      );
      CREATE POLICY "Admins can manage mock_exams" ON mock_exams FOR ALL USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
      );
      CREATE POLICY "Admins can manage flashcards" ON flashcards FOR ALL USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
      );
    `;

    // SQL'i çalıştır
    const { error: schemaError } = await supabase.rpc('exec_sql', { sql: createTablesSQL });
    
    if (schemaError) {
      console.error('Şema oluşturulurken hata:', schemaError);
      return;
    }

    console.log('✅ Veritabanı şeması oluşturuldu');

    // Örnek veriler ekle
    console.log('Örnek veriler ekleniyor...');

    // Subjects ekle
    const { data: subjects, error: subjectsError } = await supabase
      .from('subjects')
      .insert([
        { name: 'Matematik', description: 'Temel matematik konuları', color: '#3B82F6' },
        { name: 'Türkçe', description: 'Dil ve edebiyat', color: '#EF4444' },
        { name: 'Fen Bilimleri', description: 'Fizik, kimya ve bioloji', color: '#10B981' },
        { name: 'Sosyal Bilgiler', description: 'Tarih ve coğrafya', color: '#F59E0B' },
        { name: 'İngilizce', description: 'İngilizce dil becerileri', color: '#8B5CF6' }
      ])
      .select();

    if (subjectsError) {
      console.error('Subjects eklenirken hata:', subjectsError);
      return;
    }

    console.log('✅ Subjects eklendi');

    // Topics ekle
    const mathSubject = subjects.find(s => s.name === 'Matematik');
    const turkceSubject = subjects.find(s => s.name === 'Türkçe');
    const fenSubject = subjects.find(s => s.name === 'Fen Bilimleri');

    const { error: topicsError } = await supabase
      .from('topics')
      .insert([
        { subject_id: mathSubject.id, name: 'Sayılar', description: 'Doğal sayılar ve işlemler', order_index: 1 },
        { subject_id: mathSubject.id, name: 'Geometri', description: 'Şekiller ve ölçüler', order_index: 2 },
        { subject_id: mathSubject.id, name: 'Cebir', description: 'Denklemler ve eşitsizlikler', order_index: 3 },
        { subject_id: turkceSubject.id, name: 'Dil Bilgisi', description: 'Gramer kuralları', order_index: 1 },
        { subject_id: turkceSubject.id, name: 'Edebiyat', description: 'Türk edebiyatı', order_index: 2 },
        { subject_id: fenSubject.id, name: 'Fizik', description: 'Hareket ve kuvvet', order_index: 1 },
        { subject_id: fenSubject.id, name: 'Kimya', description: 'Madde ve değişim', order_index: 2 }
      ]);

    if (topicsError) {
      console.error('Topics eklenirken hata:', topicsError);
      return;
    }

    console.log('✅ Topics eklendi');

    // Quiz tests ekle
    const { error: quizTestsError } = await supabase
      .from('quiz_tests')
      .insert([
        { subject_id: mathSubject.id, name: 'Matematik Temel Test', description: 'Temel matematik sorularını içerir', time_limit: 30, question_count: 10 },
        { subject_id: turkceSubject.id, name: 'Türkçe Dil Bilgisi Testi', description: 'Gramer ve yazım kuralları', time_limit: 25, question_count: 15 },
        { subject_id: fenSubject.id, name: 'Fen Bilimleri Quiz', description: 'Fizik ve kimya soruları', time_limit: 40, question_count: 20 }
      ]);

    if (quizTestsError) {
      console.error('Quiz tests eklenirken hata:', quizTestsError);
      return;
    }

    console.log('✅ Quiz tests eklendi');

    // Mock exams ekle
    const { error: mockExamsError } = await supabase
      .from('mock_exams')
      .insert([
        { 
          name: 'Genel Yetenek Sınavı', 
          description: 'Tüm konulardan karma sorular', 
          duration: 120, 
          question_count: 50,
          subjects: JSON.stringify(['Matematik', 'Türkçe', 'Fen Bilimleri'])
        },
        { 
          name: 'Matematik Odaklı Sınav', 
          description: 'Matematik ağırlıklı deneme sınavı', 
          duration: 90, 
          question_count: 30,
          subjects: JSON.stringify(['Matematik'])
        }
      ]);

    if (mockExamsError) {
      console.error('Mock exams eklenirken hata:', mockExamsError);
      return;
    }

    console.log('✅ Mock exams eklendi');

    // Flashcards ekle
    const { error: flashcardsError } = await supabase
      .from('flashcards')
      .insert([
        { subject_id: mathSubject.id, front: '2 + 2 = ?', back: '4' },
        { subject_id: mathSubject.id, front: 'Bir üçgenin iç açıları toplamı kaçtır?', back: '180 derece' },
        { subject_id: turkceSubject.id, front: 'Özne nedir?', back: 'Cümlede işi yapan, eylemi gerçekleştiren öğe' },
        { subject_id: turkceSubject.id, front: 'Yüklem nedir?', back: 'Cümlede öznenin yaptığı işi bildiren öğe' },
        { subject_id: fenSubject.id, front: 'Suyun kaynama noktası kaç derecedir?', back: '100°C' },
        { subject_id: fenSubject.id, front: 'Işık hızı nedir?', back: '300.000 km/s' }
      ]);

    if (flashcardsError) {
      console.error('Flashcards eklenirken hata:', flashcardsError);
      return;
    }

    console.log('✅ Flashcards eklendi');

    console.log('\n🎉 Veritabanı kurulumu tamamlandı!');
    console.log('Tüm tablolar oluşturuldu ve örnek veriler eklendi.');

  } catch (error) {
    console.error('Genel hata:', error);
  }
}

setupDatabase();