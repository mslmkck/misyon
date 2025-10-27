const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkRLSStatus() {
  console.log('🔍 RLS Durumu kontrol ediliyor...\n');
  
  try {
    // Subjects tablosunu test et
    console.log('📚 Subjects tablosunu test ediliyor...');
    const { data: subjects, error: subjectsError } = await supabase
      .from('subjects')
      .select('*');
    
    if (subjectsError) {
      console.error('❌ Subjects hatası:', subjectsError.message);
    } else {
      console.log('✅ Subjects verisi:', subjects?.length, 'kayıt bulundu');
      if (subjects && subjects.length > 0) {
        console.log('   İlk kayıt:', subjects[0].name);
      }
    }
    
    // Topics tablosunu test et
    console.log('\n📖 Topics tablosunu test ediliyor...');
    const { data: topics, error: topicsError } = await supabase
      .from('topics')
      .select('*');
    
    if (topicsError) {
      console.error('❌ Topics hatası:', topicsError.message);
    } else {
      console.log('✅ Topics verisi:', topics?.length, 'kayıt bulundu');
    }
    
    // Questions tablosunu test et
    console.log('\n❓ Questions tablosunu test ediliyor...');
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('*');
    
    if (questionsError) {
      console.error('❌ Questions hatası:', questionsError.message);
    } else {
      console.log('✅ Questions verisi:', questions?.length, 'kayıt bulundu');
    }
    
    // Quiz Tests tablosunu test et
    console.log('\n🧪 Quiz Tests tablosunu test ediliyor...');
    const { data: quizTests, error: quizTestsError } = await supabase
      .from('quiz_tests')
      .select('*');
    
    if (quizTestsError) {
      console.error('❌ Quiz Tests hatası:', quizTestsError.message);
    } else {
      console.log('✅ Quiz Tests verisi:', quizTests?.length, 'kayıt bulundu');
    }
    
    // Mock Exams tablosunu test et
    console.log('\n📝 Mock Exams tablosunu test ediliyor...');
    const { data: mockExams, error: mockExamsError } = await supabase
      .from('mock_exams')
      .select('*');
    
    if (mockExamsError) {
      console.error('❌ Mock Exams hatası:', mockExamsError.message);
    } else {
      console.log('✅ Mock Exams verisi:', mockExams?.length, 'kayıt bulundu');
    }
    
    // Flashcards tablosunu test et
    console.log('\n🃏 Flashcards tablosunu test ediliyor...');
    const { data: flashcards, error: flashcardsError } = await supabase
      .from('flashcards')
      .select('*');
    
    if (flashcardsError) {
      console.error('❌ Flashcards hatası:', flashcardsError.message);
    } else {
      console.log('✅ Flashcards verisi:', flashcards?.length, 'kayıt bulundu');
    }
    
    // Announcements tablosunu test et
    console.log('\n📢 Announcements tablosunu test ediliyor...');
    const { data: announcements, error: announcementsError } = await supabase
      .from('announcements')
      .select('*');
    
    if (announcementsError) {
      console.error('❌ Announcements hatası:', announcementsError.message);
    } else {
      console.log('✅ Announcements verisi:', announcements?.length, 'kayıt bulundu');
    }
    
    console.log('\n🔍 Sonuç: Tüm tablolar kontrol edildi.');
    
  } catch (error) {
    console.error('❌ Genel hata:', error.message);
  }
}

checkRLSStatus();