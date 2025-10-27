const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkAdminUser() {
  console.log('🔍 Admin hesabı kontrol ediliyor...');
  
  try {
    const { data: users, error } = await supabase
      .from('user_profiles')
      .select('*');
    
    if (error) {
      console.log('❌ Hata:', error.message);
      return;
    }
    
    console.log('📊 Toplam kullanıcı sayısı:', users.length);
    
    if (users.length === 0) {
      console.log('⚠️  Hiç kullanıcı bulunamadı');
    } else {
      console.log('👥 Mevcut kullanıcılar:');
      users.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.full_name} (${user.email}) - Rol: ${user.role}`);
      });
      
      const adminUsers = users.filter(user => user.role === 'admin');
      if (adminUsers.length > 0) {
        console.log('✅ Admin hesabı mevcut:', adminUsers.length, 'adet');
      } else {
        console.log('❌ Admin hesabı bulunamadı');
      }
    }
  } catch (err) {
    console.log('❌ Beklenmeyen hata:', err.message);
  }
}

checkAdminUser();