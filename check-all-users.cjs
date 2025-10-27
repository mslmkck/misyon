const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkAllUsers() {
  console.log('🔍 Tüm kullanıcı bilgileri kontrol ediliyor...');
  console.log('📍 Supabase URL:', process.env.VITE_SUPABASE_URL);
  
  try {
    // 1. user_profiles tablosunu kontrol et
    console.log('\n📋 user_profiles tablosu kontrol ediliyor...');
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*');
    
    if (profilesError) {
      console.log('❌ user_profiles hatası:', profilesError.message);
    } else {
      console.log('✅ user_profiles tablosu bulundu');
      console.log('📊 Toplam profil sayısı:', profiles.length);
      
      if (profiles.length > 0) {
        console.log('\n👥 Kullanıcı profilleri:');
        profiles.forEach((profile, index) => {
          console.log(`   ${index + 1}. ${profile.first_name} ${profile.last_name} (${profile.email})`);
          console.log(`      - ID: ${profile.id}`);
          console.log(`      - Admin: ${profile.is_admin ? '✅ Evet' : '❌ Hayır'}`);
          console.log(`      - Oluşturma: ${profile.created_at}`);
          console.log('');
        });
        
        const adminCount = profiles.filter(p => p.is_admin).length;
        console.log(`🔑 Admin kullanıcı sayısı: ${adminCount}`);
      }
    }

    // 2. Auth kullanıcılarını kontrol et (sadece sayı)
    console.log('\n🔐 Auth kullanıcıları kontrol ediliyor...');
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.log('❌ Auth kullanıcıları alınamadı:', authError.message);
    } else {
      console.log('✅ Auth kullanıcıları bulundu');
      console.log('📊 Toplam auth kullanıcı sayısı:', authData.users.length);
      
      if (authData.users.length > 0) {
        console.log('\n🔐 Auth kullanıcıları:');
        authData.users.forEach((user, index) => {
          console.log(`   ${index + 1}. ${user.email}`);
          console.log(`      - ID: ${user.id}`);
          console.log(`      - Onaylandı: ${user.email_confirmed_at ? '✅ Evet' : '❌ Hayır'}`);
          console.log(`      - Son giriş: ${user.last_sign_in_at || 'Hiç giriş yapmamış'}`);
          console.log('');
        });
      }
    }

    // 3. Diğer tabloları kontrol et
    console.log('\n📊 Diğer tablolar kontrol ediliyor...');
    
    const tables = ['subjects', 'topics', 'questions', 'quiz_tests', 'mock_exams', 'flashcards', 'announcements'];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          console.log(`❌ ${table} tablosu hatası:`, error.message);
        } else {
          console.log(`✅ ${table}: ${data?.length || 0} kayıt`);
        }
      } catch (err) {
        console.log(`❌ ${table} tablosu kontrol edilemedi:`, err.message);
      }
    }

  } catch (err) {
    console.log('❌ Beklenmeyen hata:', err.message);
  }
}

checkAllUsers();