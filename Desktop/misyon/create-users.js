import { createClient } from '@supabase/supabase-js';

// Supabase client oluştur (service role key ile)
const supabase = createClient(
  'https://mexzmpmexxaauxpadkud.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1leHptcG1leHhhYXV4cGFka3VkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTQ5NTU0NiwiZXhwIjoyMDc3MDcxNTQ2fQ.qzZJwMg_sDn5dBm_yrixhZNzW6k6HgOi7fKJWnTuids',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function createTestUsers() {
  try {
    console.log('Test kullanıcıları oluşturuluyor...');

    // Test kullanıcısı oluştur
    const { data: testUser, error: testError } = await supabase.auth.admin.createUser({
      email: 'deneme@hesap.com',
      password: '123456',
      email_confirm: true,
      user_metadata: {
        full_name: 'Test Kullanıcısı',
        role: 'student'
      }
    });

    if (testError) {
      console.error('Test kullanıcısı oluşturulurken hata:', testError);
    } else {
      console.log('✅ Test kullanıcısı oluşturuldu:', testUser.user.email);
      
      // User profile oluştur
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: testUser.user.id,
          email: testUser.user.email,
          name: 'Test Kullanıcısı',
          role: 'student'
        });

      if (profileError) {
        console.error('Test kullanıcısı profili oluşturulurken hata:', profileError);
      } else {
        console.log('✅ Test kullanıcısı profili oluşturuldu');
      }
    }

    // Admin kullanıcısı oluştur
    const { data: adminUser, error: adminError } = await supabase.auth.admin.createUser({
      email: 'admin@prosinav.com',
      password: '123456',
      email_confirm: true,
      user_metadata: {
        full_name: 'Admin Kullanıcısı',
        role: 'admin'
      }
    });

    if (adminError) {
      console.error('Admin kullanıcısı oluşturulurken hata:', adminError);
    } else {
      console.log('✅ Admin kullanıcısı oluşturuldu:', adminUser.user.email);
      
      // Admin profile oluştur
      const { error: adminProfileError } = await supabase
        .from('user_profiles')
        .insert({
          id: adminUser.user.id,
          email: adminUser.user.email,
          name: 'Admin Kullanıcısı',
          role: 'admin'
        });

      if (adminProfileError) {
        console.error('Admin kullanıcısı profili oluşturulurken hata:', adminProfileError);
      } else {
        console.log('✅ Admin kullanıcısı profili oluşturuldu');
      }
    }

    console.log('\n🎉 Tüm test kullanıcıları başarıyla oluşturuldu!');
    console.log('Test Kullanıcısı: deneme@hesap.com / 123456');
    console.log('Admin Kullanıcısı: admin@prosinav.com / 123456');

  } catch (error) {
    console.error('Genel hata:', error);
  }
}

createTestUsers();