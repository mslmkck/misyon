import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('Supabase URL:', supabaseUrl)
console.log('Service Key:', supabaseServiceKey ? 'Mevcut' : 'Eksik')

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Supabase service key bilgileri eksik!')
  process.exit(1)
}

// Service role key ile client oluştur (RLS bypass)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function testWithServiceKey() {
  console.log('\n🔄 Service Key ile test başlıyor (RLS bypass)...\n')

  try {
    // Subjects tablosunu test et
    console.log('📚 Subjects tablosu test ediliyor...')
    const { data: subjects, error: subjectsError } = await supabase
      .from('subjects')
      .select('*')
    
    if (subjectsError) {
      console.error('❌ Subjects hatası:', subjectsError)
    } else {
      console.log('✅ Subjects tablosu başarılı')
      console.log(`📊 Toplam konu sayısı: ${subjects.length}`)
      if (subjects.length > 0) {
        console.log('📋 Konular:')
        subjects.forEach((subject, index) => {
          console.log(`   ${index + 1}. ${subject.name}`)
        })
      }
    }

    // Topics tablosunu test et
    console.log('\n📖 Topics tablosu test ediliyor...')
    const { data: topics, error: topicsError } = await supabase
      .from('topics')
      .select('*')
    
    if (topicsError) {
      console.error('❌ Topics hatası:', topicsError)
    } else {
      console.log('✅ Topics tablosu başarılı')
      console.log(`📊 Toplam konu başlığı sayısı: ${topics.length}`)
    }

    // Questions tablosunu test et
    console.log('\n❓ Questions tablosu test ediliyor...')
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('*')
    
    if (questionsError) {
      console.error('❌ Questions hatası:', questionsError)
    } else {
      console.log('✅ Questions tablosu başarılı')
      console.log(`📊 Toplam soru sayısı: ${questions.length}`)
    }

    // Flashcards tablosunu test et
    console.log('\n🃏 Flashcards tablosu test ediliyor...')
    const { data: flashcards, error: flashcardsError } = await supabase
      .from('flashcards')
      .select('*')
    
    if (flashcardsError) {
      console.error('❌ Flashcards hatası:', flashcardsError)
    } else {
      console.log('✅ Flashcards tablosu başarılı')
      console.log(`📊 Toplam flashcard sayısı: ${flashcards.length}`)
    }

    console.log('\n🎉 Service Key testi tamamlandı!')
    
    // Özet
    const totalData = (subjects?.length || 0) + (topics?.length || 0) + 
                     (questions?.length || 0) + (flashcards?.length || 0)
    
    console.log(`\n📈 ÖZET (Service Key ile):`)
    console.log(`   Konular: ${subjects?.length || 0}`)
    console.log(`   Konu Başlıkları: ${topics?.length || 0}`)
    console.log(`   Sorular: ${questions?.length || 0}`)
    console.log(`   Flashcardlar: ${flashcards?.length || 0}`)
    console.log(`   TOPLAM VERİ: ${totalData}`)
    
    if (totalData > 0) {
      console.log('\n✅ Veriler mevcut! RLS politikaları sorunu var olabilir.')
    } else {
      console.log('\n❌ Veriler gerçekten yok.')
    }

  } catch (error) {
    console.error('❌ Test hatası:', error)
  }
}

testWithServiceKey()