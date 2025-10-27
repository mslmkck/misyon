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

async function setupSampleData() {
  try {
    console.log('Örnek veriler ekleniyor...');

    // Önce mevcut verileri kontrol et
    const { data: existingSubjects } = await supabase
      .from('subjects')
      .select('*')
      .limit(1);

    if (existingSubjects && existingSubjects.length > 0) {
      console.log('Veriler zaten mevcut, işlem atlanıyor...');
      return;
    }

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

    console.log('✅ Subjects eklendi:', subjects.length);

    // Topics ekle
    const mathSubject = subjects.find(s => s.name === 'Matematik');
    const turkceSubject = subjects.find(s => s.name === 'Türkçe');
    const fenSubject = subjects.find(s => s.name === 'Fen Bilimleri');

    const { data: topics, error: topicsError } = await supabase
      .from('topics')
      .insert([
        { subject_id: mathSubject.id, name: 'Sayılar', description: 'Doğal sayılar ve işlemler', order_index: 1 },
        { subject_id: mathSubject.id, name: 'Geometri', description: 'Şekiller ve ölçüler', order_index: 2 },
        { subject_id: mathSubject.id, name: 'Cebir', description: 'Denklemler ve eşitsizlikler', order_index: 3 },
        { subject_id: turkceSubject.id, name: 'Dil Bilgisi', description: 'Gramer kuralları', order_index: 1 },
        { subject_id: turkceSubject.id, name: 'Edebiyat', description: 'Türk edebiyatı', order_index: 2 },
        { subject_id: fenSubject.id, name: 'Fizik', description: 'Hareket ve kuvvet', order_index: 1 },
        { subject_id: fenSubject.id, name: 'Kimya', description: 'Madde ve değişim', order_index: 2 }
      ])
      .select();

    if (topicsError) {
      console.error('Topics eklenirken hata:', topicsError);
      return;
    }

    console.log('✅ Topics eklendi:', topics.length);

    // Questions ekle
    const sayilarTopic = topics.find(t => t.name === 'Sayılar');
    const geometriTopic = topics.find(t => t.name === 'Geometri');
    const dilBilgisiTopic = topics.find(t => t.name === 'Dil Bilgisi');

    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .insert([
        {
          topic_id: sayilarTopic.id,
          question_text: '5 + 3 = ?',
          options: JSON.stringify(['6', '7', '8', '9']),
          correct_answer: 2,
          explanation: '5 + 3 = 8',
          difficulty: 'easy'
        },
        {
          topic_id: sayilarTopic.id,
          question_text: '12 ÷ 4 = ?',
          options: JSON.stringify(['2', '3', '4', '6']),
          correct_answer: 1,
          explanation: '12 ÷ 4 = 3',
          difficulty: 'easy'
        },
        {
          topic_id: geometriTopic.id,
          question_text: 'Bir üçgenin iç açıları toplamı kaçtır?',
          options: JSON.stringify(['90°', '180°', '270°', '360°']),
          correct_answer: 1,
          explanation: 'Üçgenin iç açıları toplamı her zaman 180°dir.',
          difficulty: 'medium'
        },
        {
          topic_id: dilBilgisiTopic.id,
          question_text: 'Aşağıdakilerden hangisi özne örneğidir?',
          options: JSON.stringify(['Kitap', 'Okudu', 'Hızlıca', 'Masada']),
          correct_answer: 0,
          explanation: 'Özne, cümlede işi yapan varlıktır.',
          difficulty: 'medium'
        }
      ])
      .select();

    if (questionsError) {
      console.error('Questions eklenirken hata:', questionsError);
      return;
    }

    console.log('✅ Questions eklendi:', questions.length);

    // Quiz tests ekle
    const { data: quizTests, error: quizTestsError } = await supabase
      .from('quiz_tests')
      .insert([
        { subject_id: mathSubject.id, name: 'Matematik Temel Test', description: 'Temel matematik sorularını içerir', time_limit: 30, question_count: 10 },
        { subject_id: turkceSubject.id, name: 'Türkçe Dil Bilgisi Testi', description: 'Gramer ve yazım kuralları', time_limit: 25, question_count: 15 },
        { subject_id: fenSubject.id, name: 'Fen Bilimleri Quiz', description: 'Fizik ve kimya soruları', time_limit: 40, question_count: 20 }
      ])
      .select();

    if (quizTestsError) {
      console.error('Quiz tests eklenirken hata:', quizTestsError);
      return;
    }

    console.log('✅ Quiz tests eklendi:', quizTests.length);

    // Mock exams ekle
    const { data: mockExams, error: mockExamsError } = await supabase
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
      ])
      .select();

    if (mockExamsError) {
      console.error('Mock exams eklenirken hata:', mockExamsError);
      return;
    }

    console.log('✅ Mock exams eklendi:', mockExams.length);

    // Flashcards ekle
    const { data: flashcards, error: flashcardsError } = await supabase
      .from('flashcards')
      .insert([
        { subject_id: mathSubject.id, front: '2 + 2 = ?', back: '4' },
        { subject_id: mathSubject.id, front: 'Bir üçgenin iç açıları toplamı kaçtır?', back: '180 derece' },
        { subject_id: turkceSubject.id, front: 'Özne nedir?', back: 'Cümlede işi yapan, eylemi gerçekleştiren öğe' },
        { subject_id: turkceSubject.id, front: 'Yüklem nedir?', back: 'Cümlede öznenin yaptığı işi bildiren öğe' },
        { subject_id: fenSubject.id, front: 'Suyun kaynama noktası kaç derecedir?', back: '100°C' },
        { subject_id: fenSubject.id, front: 'Işık hızı nedir?', back: '300.000 km/s' }
      ])
      .select();

    if (flashcardsError) {
      console.error('Flashcards eklenirken hata:', flashcardsError);
      return;
    }

    console.log('✅ Flashcards eklendi:', flashcards.length);

    console.log('\n🎉 Örnek veriler başarıyla eklendi!');
    console.log(`- ${subjects.length} subject`);
    console.log(`- ${topics.length} topic`);
    console.log(`- ${questions.length} question`);
    console.log(`- ${quizTests.length} quiz test`);
    console.log(`- ${mockExams.length} mock exam`);
    console.log(`- ${flashcards.length} flashcard`);

  } catch (error) {
    console.error('Genel hata:', error);
  }
}

setupSampleData();