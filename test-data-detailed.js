import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key:', supabaseKey ? 'Mevcut' : 'Eksik')

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase bilgileri eksik!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testDetailedData() {
  console.log('\n🔄 Detaylı veri testi başlıyor...\n')

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
        console.log('📋 İlk 3 konu:')
        subjects.slice(0, 3).forEach((subject, index) => {
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
      if (questions.length > 0) {
        console.log('📋 İlk soru:')
        console.log(`   ${questions[0].question}`)
      }
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

    // Mock Exams tablosunu test et
    console.log('\n📝 Mock Exams tablosu test ediliyor...')
    const { data: mockExams, error: mockExamsError } = await supabase
      .from('mock_exams')
      .select('*')
    
    if (mockExamsError) {
      console.error('❌ Mock Exams hatası:', mockExamsError)
    } else {
      console.log('✅ Mock Exams tablosu başarılı')
      console.log(`📊 Toplam deneme sınavı sayısı: ${mockExams.length}`)
    }

    console.log('\n🎉 Detaylı test tamamlandı!')
    
    // Özet
    const totalData = (subjects?.length || 0) + (topics?.length || 0) + 
                     (questions?.length || 0) + (flashcards?.length || 0) + 
                     (mockExams?.length || 0)
    
    console.log(`\n📈 ÖZET:`)
    console.log(`   Konular: ${subjects?.length || 0}`)
    console.log(`   Konu Başlıkları: ${topics?.length || 0}`)
    console.log(`   Sorular: ${questions?.length || 0}`)
    console.log(`   Flashcardlar: ${flashcards?.length || 0}`)
    console.log(`   Deneme Sınavları: ${mockExams?.length || 0}`)
    console.log(`   TOPLAM VERİ: ${totalData}`)
    
    if (totalData === 0) {
      console.log('\n⚠️  Hiç veri bulunamadı! Örnek verileri yüklemeniz gerekiyor.')
    } else {
      console.log('\n✅ Veritabanı hazır!')
    }

  } catch (error) {
    console.error('❌ Test hatası:', error)
  }
}

testDetailedData()