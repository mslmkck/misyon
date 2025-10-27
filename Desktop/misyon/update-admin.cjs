const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function updateUserToAdmin() {
  console.log('🔧 Kullanıcıyı admin yapma işlemi başlıyor...');
  
  try {
    // Önce mevcut kullanıcıları listele
    const { data: users, error: listError } = await supabase
      .from('user_profiles')
      .select('*');
    
    if (listError) {
      console.log('❌ Kullanıcıları listeleme hatası:', listError.message);
      return;
    }
    
    console.log('📊 Mevcut kullanıcılar:', users.length);
    
    if (users.length === 0) {
      console.log('⚠️  Hiç kullanıcı bulunamadı. Önce bir hesap oluşturun.');
      return;
    }
    
    // İlk kullanıcıyı admin yap
    const firstUser = users[0];
    console.log('👤 Admin yapılacak kullanıcı:', firstUser.email);
    
    const { data: updateData, error: updateError } = await supabase
      .from('user_profiles')
      .update({ is_admin: true })
      .eq('id', firstUser.id)
      .select();
    
    if (updateError) {
      console.log('❌ Güncelleme hatası:', updateError.message);
      return;
    }
    
    console.log('✅ Kullanıcı başarıyla admin yapıldı:', updateData);
    console.log('🎉 İşlem tamamlandı!');
    console.log('📧 Admin Email:', firstUser.email);
    
  } catch (err) {
    console.log('❌ Beklenmeyen hata:', err.message);
  }
}

updateUserToAdmin();