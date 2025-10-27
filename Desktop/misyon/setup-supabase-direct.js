import { createClient } from '@supabase/supabase-js';

// Yeni Supabase client oluştur (service role key ile)
const supabase = createClient(
  'https://qdyezbtbmkwibedukdml.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkeWV6YnRibWt3aWJlZHVrZG1sIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTUyMDMzOSwiZXhwIjoyMDc3MDk2MzM5fQ.GZmVdOFzmJB4iFfsbZ730t4JDLZ07vYG6YL9O6cFt7k',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function setupDatabase() {
  try {
    console.log('🚀 Veritabanı şeması oluşturuluyor...');

    // 1. User Profiles tablosu
    console.log('📝 User profiles tablosu oluşturuluyor...');
    const { error: userProfilesError } = await supabase
      .from('user_profiles')
      .select('id')
      .limit(1);

    if (userProfilesError && userProfilesError.code === 'PGRST116') {
      // Tablo yok, oluştur
      const { error } = await supabase.rpc('exec', {
        sql: `
          CREATE TABLE public.user_profiles (
              id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
              first_name TEXT NOT NULL,
              last_name TEXT NOT NULL,
              email TEXT NOT NULL UNIQUE,
              is_admin BOOLEAN DEFAULT FALSE,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });
      if (error) console.log('User profiles tablo hatası:', error);
      else console.log('✅ User profiles tablosu oluşturuldu');
    }

    // 2. Subjects tablosu
    console.log('📝 Subjects tablosu oluşturuluyor...');
    const { error: subjectsError } = await supabase
      .from('subjects')
      .select('id')
      .limit(1);

    if (subjectsError && subjectsError.code === 'PGRST116') {
      // Tablo yok, oluştur
      const { error } = await supabase.rpc('exec', {
        sql: `
          CREATE TABLE public.subjects (
              id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
              name TEXT NOT NULL,
              description TEXT,
              icon_name TEXT,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });
      if (error) console.log('Subjects tablo hatası:', error);
      else console.log('✅ Subjects tablosu oluşturuldu');
    }

    // Örnek verileri ekle
    console.log('📝 Örnek veriler ekleniyor...');
    const { data: existingSubjects } = await supabase
      .from('subjects')
      .select('id')
      .limit(1);

    if (!existingSubjects || existingSubjects.length === 0) {
      const { error: insertError } = await supabase
        .from('subjects')
        .insert([
          {
            id: '550e8400-e29b-41d4-a716-446655440001',
            name: 'Anayasa Hukuku',
            description: 'Temel anayasal kavramlar, devlet yapısı ve temel haklar.',
            icon_name: 'BookOpenIcon'
          },
          {
            id: '550e8400-e29b-41d4-a716-446655440002',
            name: 'İdare Hukuku',
            description: 'İdarenin yapısı, işleyişi ve idari işlemler.',
            icon_name: 'BookOpenIcon'
          },
          {
            id: '550e8400-e29b-41d4-a716-446655440003',
            name: 'Ceza Hukuku',
            description: 'Suç ve ceza kavramları, genel ve özel hükümler.',
            icon_name: 'BookOpenIcon'
          },
          {
            id: '550e8400-e29b-41d4-a716-446655440004',
            name: 'Ceza Muhakemesi Hukuku',
            description: 'Soruşturma, kovuşturma ve yargılama süreçleri.',
            icon_name: 'BookOpenIcon'
          },
          {
            id: '550e8400-e29b-41d4-a716-446655440005',
            name: 'Genel Kültür',
            description: 'Tarih, coğrafya, edebiyat ve genel bilgiler.',
            icon_name: 'BookOpenIcon'
          }
        ]);

      if (insertError) {
        console.log('Örnek veri ekleme hatası:', insertError);
      } else {
        console.log('✅ Örnek veriler başarıyla eklendi!');
      }
    }

    console.log('🎉 Supabase veritabanı kurulumu tamamlandı!');

  } catch (error) {
    console.error('❌ Genel hata:', error);
  }
}

// Kurulumu başlat
setupDatabase();