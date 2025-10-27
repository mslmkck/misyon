const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Normal kullanıcı erişimi için anon key kullan
const supabaseUser = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Admin erişimi için service role key kullan
const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testUserAccess() {
  console.log('🔍 Kullanıcı Erişimi Test Ediliyor...\n');
  
  try {
    console.log('👤 NORMAL KULLANICI ERİŞİMİ (Anon Key):');
    console.log('=====================================');
    
    // Subjects tablosunu normal kullanıcı olarak test et
    console.log('\n📚 Subjects tablosu (Normal Kullanıcı):');
    const { data: userSubjects, error: userSubjectsError } = await supabaseUser
      .from('subjects')
      .select('*');
    
    if (userSubjectsError) {
      console.error('❌ Normal kullanıcı Subjects hatası:', userSubjectsError.message);
    } else {
      console.log('✅ Normal kullanıcı Subjects verisi:', userSubjects?.length, 'kayıt');
    }
    
    // Questions tablosunu normal kullanıcı olarak test et
    console.log('\n❓ Questions tablosu (Normal Kullanıcı):');
    const { data: userQuestions, error: userQuestionsError } = await supabaseUser
      .from('questions')
      .select('*');
    
    if (userQuestionsError) {
      console.error('❌ Normal kullanıcı Questions hatası:', userQuestionsError.message);
    } else {
      console.log('✅ Normal kullanıcı Questions verisi:', userQuestions?.length, 'kayıt');
    }
    
    // Mock Exams tablosunu normal kullanıcı olarak test et
    console.log('\n📝 Mock Exams tablosu (Normal Kullanıcı):');
    const { data: userMockExams, error: userMockExamsError } = await supabaseUser
      .from('mock_exams')
      .select('*');
    
    if (userMockExamsError) {
      console.error('❌ Normal kullanıcı Mock Exams hatası:', userMockExamsError.message);
    } else {
      console.log('✅ Normal kullanıcı Mock Exams verisi:', userMockExams?.length, 'kayıt');
    }
    
    // Flashcards tablosunu normal kullanıcı olarak test et
    console.log('\n🃏 Flashcards tablosu (Normal Kullanıcı):');
    const { data: userFlashcards, error: userFlashcardsError } = await supabaseUser
      .from('flashcards')
      .select('*');
    
    if (userFlashcardsError) {
      console.error('❌ Normal kullanıcı Flashcards hatası:', userFlashcardsError.message);
    } else {
      console.log('✅ Normal kullanıcı Flashcards verisi:', userFlashcards?.length, 'kayıt');
    }
    
    // Announcements tablosunu normal kullanıcı olarak test et
    console.log('\n📢 Announcements tablosu (Normal Kullanıcı):');
    const { data: userAnnouncements, error: userAnnouncementsError } = await supabaseUser
      .from('announcements')
      .select('*');
    
    if (userAnnouncementsError) {
      console.error('❌ Normal kullanıcı Announcements hatası:', userAnnouncementsError.message);
    } else {
      console.log('✅ Normal kullanıcı Announcements verisi:', userAnnouncements?.length, 'kayıt');
    }
    
    console.log('\n\n👨‍💼 ADMİN ERİŞİMİ (Service Role Key):');
    console.log('=====================================');
    
    // Admin erişimi ile aynı tabloları test et
    console.log('\n📚 Subjects tablosu (Admin):');
    const { data: adminSubjects, error: adminSubjectsError } = await supabaseAdmin
      .from('subjects')
      .select('*');
    
    if (adminSubjectsError) {
      console.error('❌ Admin Subjects hatası:', adminSubjectsError.message);
    } else {
      console.log('✅ Admin Subjects verisi:', adminSubjects?.length, 'kayıt');
    }
    
    console.log('\n❓ Questions tablosu (Admin):');
    const { data: adminQuestions, error: adminQuestionsError } = await supabaseAdmin
      .from('questions')
      .select('*');
    
    if (adminQuestionsError) {
      console.error('❌ Admin Questions hatası:', adminQuestionsError.message);
    } else {
      console.log('✅ Admin Questions verisi:', adminQuestions?.length, 'kayıt');
    }
    
    console.log('\n🔍 SONUÇ ANALİZİ:');
    console.log('================');
    
    if (userSubjects?.length === 0 && adminSubjects?.length > 0) {
      console.log('⚠️  SORUN TESPİT EDİLDİ: Normal kullanıcılar veri göremiyor!');
      console.log('   RLS politikaları çok kısıtlayıcı olabilir.');
    } else if (userSubjects?.length > 0) {
      console.log('✅ Normal kullanıcılar veri görebiliyor.');
    }
    
  } catch (error) {
    console.error('❌ Genel hata:', error.message);
  }
}

testUserAccess();