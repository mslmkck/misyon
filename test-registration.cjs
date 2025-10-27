const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function testRegistration() {
  console.log('🧪 Kayıt işlemi test ediliyor...');
  
  const testEmail = `test${Date.now()}@example.com`;
  const testPassword = 'test123456';
  
  try {
    // 1. Yeni kullanıcı kaydı
    console.log('📝 Yeni kullanıcı kaydediliyor:', testEmail);
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          first_name: 'Test',
          last_name: 'User'
        }
      }
    });

    if (authError) {
      console.log('❌ Kayıt hatası:', authError.message);
      return;
    }

    console.log('✅ Auth kullanıcısı oluşturuldu:', authData.user?.id);

    // 2. Profil oluşturma
    if (authData.user) {
      console.log('👤 Kullanıcı profili oluşturuluyor...');
      
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .insert([
          {
            id: authData.user.id,
            email: testEmail,
            first_name: 'Test',
            last_name: 'User',
            is_admin: false
          }
        ])
        .select();

      if (profileError) {
        console.log('❌ Profil oluşturma hatası:', profileError.message);
      } else {
        console.log('✅ Profil oluşturuldu:', profileData);
      }
    }

    // 3. Oluşturulan kullanıcıları kontrol et
    console.log('\n📊 Güncel kullanıcı sayısı kontrol ediliyor...');
    
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*');
    
    if (profilesError) {
      console.log('❌ Profil listesi alınamadı:', profilesError.message);
    } else {
      console.log('✅ Toplam profil sayısı:', profiles.length);
      if (profiles.length > 0) {
        console.log('👥 Kullanıcılar:');
        profiles.forEach((profile, index) => {
          console.log(`   ${index + 1}. ${profile.first_name} ${profile.last_name} (${profile.email})`);
          console.log(`      - Admin: ${profile.is_admin ? '✅' : '❌'}`);
        });
      }
    }

  } catch (err) {
    console.log('❌ Beklenmeyen hata:', err.message);
  }
}

testRegistration();