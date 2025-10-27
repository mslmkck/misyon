import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// .env dosyasını yükle
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseKey ? 'Mevcut' : 'Bulunamadı');

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase bilgileri eksik!');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    try {
        console.log('\n🔄 Supabase bağlantısı test ediliyor...');
        
        // Subjects tablosunu test et
        const { data: subjects, error: subjectsError } = await supabase
            .from('subjects')
            .select('*')
            .limit(5);
            
        if (subjectsError) {
            console.error('❌ Subjects tablosu hatası:', subjectsError.message);
            return false;
        }
        
        console.log('✅ Subjects tablosu başarıyla okundu');
        console.log(`📊 Toplam konu sayısı: ${subjects.length}`);
        
        if (subjects.length > 0) {
            console.log('📝 İlk konu:', subjects[0].name);
        }
        
        // User profiles tablosunu test et
        const { data: profiles, error: profilesError } = await supabase
            .from('user_profiles')
            .select('*')
            .limit(1);
            
        if (profilesError) {
            console.error('❌ User profiles tablosu hatası:', profilesError.message);
            return false;
        }
        
        console.log('✅ User profiles tablosu başarıyla okundu');
        
        // Questions tablosunu test et
        const { data: questions, error: questionsError } = await supabase
            .from('questions')
            .select('*')
            .limit(1);
            
        if (questionsError) {
            console.error('❌ Questions tablosu hatası:', questionsError.message);
            return false;
        }
        
        console.log('✅ Questions tablosu başarıyla okundu');
        
        console.log('\n🎉 Tüm testler başarılı! Supabase bağlantısı çalışıyor.');
        return true;
        
    } catch (error) {
        console.error('❌ Bağlantı hatası:', error.message);
        return false;
    }
}

testConnection();