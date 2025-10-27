const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function createAdminUser() {
  console.log('👤 Admin hesabı oluşturuluyor...');
  
  try {
    // Önce admin hesabını kayıt et
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'admin@prosinav.com',
      password: 'admin123456',
      options: {
        data: {
          first_name: 'Admin',
          last_name: 'User'
        }
      }
    });

    if (authError) {
      console.log('❌ Auth hatası:', authError.message);
      return;
    }

    console.log('✅ Auth kullanıcısı oluşturuldu:', authData.user?.email);

    // Kullanıcı profilini oluştur
    if (authData.user) {
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .insert([
          {
            id: authData.user.id,
            email: 'admin@prosinav.com',
            first_name: 'Admin',
            last_name: 'User',
            is_admin: true
          }
        ])
        .select();

      if (profileError) {
        console.log('❌ Profil hatası:', profileError.message);
        return;
      }

      console.log('✅ Admin profili oluşturuldu:', profileData);
      console.log('🎉 Admin hesabı başarıyla oluşturuldu!');
      console.log('📧 Email: admin@prosinav.com');
      console.log('🔑 Şifre: admin123456');
    }
  } catch (err) {
    console.log('❌ Beklenmeyen hata:', err.message);
  }
}

createAdminUser();