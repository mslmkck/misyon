const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function createAnnouncementsTable() {
  console.log('📢 Announcements tablosunu test ediliyor...');
  
  // Try to create a simple announcement to test
  const { data, error } = await supabase
    .from('announcements')
    .insert([
      {
        title: 'Hoş Geldiniz!',
        content: 'Yeni duyuru sistemi aktif edildi. Önemli duyurular burada görünecek.',
        is_active: true
      }
    ])
    .select();
  
  if (error) {
    console.error('❌ Announcements tablosu bulunamadı veya erişim hatası:', error.message);
    console.log('Lütfen Supabase Dashboard\'dan announcements tablosunu manuel olarak oluşturun.');
  } else {
    console.log('✅ Announcements tablosu mevcut ve test duyurusu eklendi!');
    console.log('Test verisi:', data);
    
    // Now let's try to fetch announcements
    const { data: fetchedData, error: fetchError } = await supabase
      .from('announcements')
      .select('*')
      .eq('is_active', true);
      
    if (fetchError) {
      console.error('❌ Duyurular getirilemedi:', fetchError.message);
    } else {
      console.log('✅ Aktif duyurular başarıyla getirildi:', fetchedData);
    }
  }
}

createAnnouncementsTable().catch(console.error);