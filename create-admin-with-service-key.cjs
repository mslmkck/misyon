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

async function createAdminUser() {
  console.log('🔑 Service role key ile admin kullanıcı oluşturuluyor...');
  
  const adminEmail = 'admin@prosinav.com';
  const adminPassword = 'admin123456';
  
  try {
    // 1. Admin kullanıcısını oluştur
    console.log('👤 Admin kullanıcısı oluşturuluyor:', adminEmail);
    
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        first_name: 'Admin',
        last_name: 'User'
      }
    });

    if (authError) {
      console.log('❌ Admin kullanıcı oluşturma hatası:', authError.message);
      return;
    }

    console.log('✅ Admin kullanıcısı oluşturuldu:', authData.user?.id);

    // 2. Admin profili oluştur
    if (authData.user) {
      console.log('👑 Admin profili oluşturuluyor...');
      
      const { data: profileData, error: profileError } = await supabaseAdmin
        .from('user_profiles')
        .insert([
          {
            id: authData.user.id,
            email: adminEmail,
            first_name: 'Admin',
            last_name: 'User',
            is_admin: true
          }
        ])
        .select();

      if (profileError) {
        console.log('❌ Admin profil oluşturma hatası:', profileError.message);
      } else {
        console.log('✅ Admin profili oluşturuldu:', profileData);
      }
    }

    // 3. Tüm kullanıcıları listele
    console.log('\n📊 Tüm kullanıcılar kontrol ediliyor...');
    
    const { data: profiles, error: profilesError } = await supabaseAdmin
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
          console.log(`      - Admin: ${profile.is_admin ? '👑 Evet' : '👤 Hayır'}`);
        });
      }
    }

    // 4. Auth kullanıcılarını da listele
    console.log('\n🔐 Auth kullanıcıları:');
    const { data: authUsers, error: authUsersError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (authUsersError) {
      console.log('❌ Auth kullanıcıları alınamadı:', authUsersError.message);
    } else {
      console.log('✅ Toplam auth kullanıcı sayısı:', authUsers.users.length);
      authUsers.users.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.email} (${user.id})`);
      });
    }

  } catch (err) {
    console.log('❌ Beklenmeyen hata:', err.message);
  }
}

createAdminUser();