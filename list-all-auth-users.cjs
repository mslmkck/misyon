const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Service role key ile admin client oluştur
const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function listAllUsers() {
  console.log('🔍 Tüm kullanıcılar service key ile kontrol ediliyor...');
  
  try {
    // 1. Auth kullanıcılarını listele
    console.log('\n🔐 Auth kullanıcıları:');
    const { data: authUsers, error: authUsersError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (authUsersError) {
      console.log('❌ Auth kullanıcıları alınamadı:', authUsersError.message);
    } else {
      console.log('✅ Toplam auth kullanıcı sayısı:', authUsers.users.length);
      
      if (authUsers.users.length > 0) {
        authUsers.users.forEach((user, index) => {
          console.log(`\n   ${index + 1}. ${user.email}`);
          console.log(`      - ID: ${user.id}`);
          console.log(`      - Onaylandı: ${user.email_confirmed_at ? '✅ Evet' : '❌ Hayır'}`);
          console.log(`      - Son giriş: ${user.last_sign_in_at || 'Hiç giriş yapmamış'}`);
          console.log(`      - Oluşturma: ${user.created_at}`);
        });
      }
    }

    // 2. User profiles tablosunu kontrol et
    console.log('\n📋 User profiles tablosu:');
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('user_profiles')
      .select('*');
    
    if (profilesError) {
      console.log('❌ Profil listesi alınamadı:', profilesError.message);
    } else {
      console.log('✅ Toplam profil sayısı:', profiles.length);
      
      if (profiles.length > 0) {
        profiles.forEach((profile, index) => {
          console.log(`\n   ${index + 1}. ${profile.first_name} ${profile.last_name}`);
          console.log(`      - Email: ${profile.email}`);
          console.log(`      - ID: ${profile.id}`);
          console.log(`      - Admin: ${profile.is_admin ? '👑 Evet' : '👤 Hayır'}`);
          console.log(`      - Oluşturma: ${profile.created_at}`);
        });
      }
    }

    // 3. Auth kullanıcıları ile profilleri eşleştir
    if (authUsers && authUsers.users.length > 0 && profiles && profiles.length > 0) {
      console.log('\n🔗 Eşleştirme durumu:');
      
      authUsers.users.forEach(authUser => {
        const profile = profiles.find(p => p.id === authUser.id);
        if (profile) {
          console.log(`✅ ${authUser.email} - Profil var (Admin: ${profile.is_admin ? 'Evet' : 'Hayır'})`);
        } else {
          console.log(`❌ ${authUser.email} - Profil eksik`);
        }
      });
    }

  } catch (err) {
    console.log('❌ Beklenmeyen hata:', err.message);
  }
}

listAllUsers();