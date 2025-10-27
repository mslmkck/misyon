// Örnek ders verileri ekleme scripti
const sampleSubjects = [
  {
    id: 'anayasa-hukuku',
    name: 'Anayasa Hukuku',
    description: 'Temel anayasal kavramlar, devlet yapısı ve temel haklar.',
    icon: null,
    topics: [
      {
        id: 'anayasa-1',
        title: 'Anayasanın Üstünlüğü',
        content: `
          <h2>Anayasanın Üstünlüğü İlkesi</h2>
          <p>Anayasanın üstünlüğü, anayasanın hukuk sistemindeki en yüksek norm olduğunu ifade eder.</p>
          
          <h3>Temel Özellikler:</h3>
          <ul>
            <li>Anayasa, tüm hukuki normların üstündedir</li>
            <li>Anayasaya aykırı hiçbir norm geçerli olamaz</li>
            <li>Anayasa Mahkemesi anayasaya uygunluğu denetler</li>
          </ul>
          
          <h3>Sonuçları:</h3>
          <p>Bu ilke, hukuk devleti ilkesinin temelini oluşturur ve demokratik düzenin korunmasını sağlar.</p>
        `
      },
      {
        id: 'anayasa-2',
        title: 'Temel Haklar ve Özgürlükler',
        content: `
          <h2>Temel Haklar ve Özgürlükler</h2>
          <p>Anayasanın ikinci bölümünde düzenlenen temel haklar, bireylerin devlete karşı sahip oldukları haklardır.</p>
          
          <h3>Sınıflandırma:</h3>
          <ul>
            <li><strong>Kişi Hakları:</strong> Yaşam hakkı, kişi güvenliği, özel hayat</li>
            <li><strong>Düşünce ve İnanç Özgürlüğü:</strong> İfade özgürlüğü, din ve vicdan özgürlüğü</li>
            <li><strong>Sosyal ve Ekonomik Haklar:</strong> Çalışma hakkı, eğitim hakkı, sağlık hakkı</li>
          </ul>
          
          <h3>Sınırlandırma:</h3>
          <p>Temel haklar mutlak değildir ve anayasada belirtilen şartlarda sınırlandırılabilir.</p>
        `
      }
    ]
  },
  {
    id: 'idare-hukuku',
    name: 'İdare Hukuku',
    description: 'İdarenin yapısı, işleyişi ve idari işlemler.',
    icon: null,
    topics: [
      {
        id: 'idare-1',
        title: 'İdari İşlemler',
        content: `
          <h2>İdari İşlemler</h2>
          <p>İdari işlem, idarenin tek taraflı irade beyanı ile hukuki sonuç doğuran işlemleridir.</p>
          
          <h3>Özellikleri:</h3>
          <ul>
            <li>Tek taraflı irade beyanı</li>
            <li>Hukuki sonuç doğurma</li>
            <li>İcra edilebilirlik</li>
            <li>Kamu gücü kullanımı</li>
          </ul>
          
          <h3>Türleri:</h3>
          <ul>
            <li><strong>Bireysel İşlemler:</strong> Belirli kişilere yönelik</li>
            <li><strong>Düzenleyici İşlemler:</strong> Genel ve soyut kurallar</li>
          </ul>
        `
      },
      {
        id: 'idare-2',
        title: 'İdari Yargı',
        content: `
          <h2>İdari Yargı</h2>
          <p>İdari yargı, idarenin işlem ve eylemlerini denetleyen özel yargı kolunun adıdır.</p>
          
          <h3>Danıştay:</h3>
          <ul>
            <li>İdari yargının en yüksek mahkemesi</li>
            <li>Temyiz mercii</li>
            <li>İdari düzenlemeleri denetler</li>
          </ul>
          
          <h3>İdari Mahkemeler:</h3>
          <ul>
            <li>İlk derece mahkemeleri</li>
            <li>İdari işlemleri denetler</li>
            <li>Tam yargı davalarına bakar</li>
          </ul>
        `
      }
    ]
  },
  {
    id: 'ceza-hukuku',
    name: 'Ceza Hukuku',
    description: 'Suç ve ceza kavramları, genel ve özel hükümler.',
    icon: null,
    topics: [
      {
        id: 'ceza-1',
        title: 'Suçun Unsurları',
        content: `
          <h2>Suçun Unsurları</h2>
          <p>Bir fiilin suç sayılabilmesi için belirli unsurları taşıması gerekir.</p>
          
          <h3>Kanuni Unsur:</h3>
          <ul>
            <li>Suç kanunda tanımlanmış olmalı</li>
            <li>"Kanunsuz suç olmaz" ilkesi</li>
            <li>Tipiklik</li>
          </ul>
          
          <h3>Maddi Unsur:</h3>
          <ul>
            <li>Hareket (fiil)</li>
            <li>Netice</li>
            <li>Nedensellik bağı</li>
          </ul>
          
          <h3>Manevi Unsur:</h3>
          <ul>
            <li>Kasıt</li>
            <li>Taksir</li>
            <li>Kusur</li>
          </ul>
        `
      }
    ]
  },
  {
    id: 'medeni-hukuk',
    name: 'Medeni Hukuk',
    description: 'Kişiler hukuku, aile hukuku ve miras hukuku.',
    icon: null,
    topics: [
      {
        id: 'medeni-1',
        title: 'Kişilik Hakları',
        content: `
          <h2>Kişilik Hakları</h2>
          <p>Kişilik hakları, kişinin varlığını korumaya yönelik haklardır.</p>
          
          <h3>Genel Kişilik Hakkı:</h3>
          <ul>
            <li>Yaşam hakkı</li>
            <li>Vücut bütünlüğü</li>
            <li>Ruhsal bütünlük</li>
          </ul>
          
          <h3>Özel Kişilik Hakları:</h3>
          <ul>
            <li>Ad hakkı</li>
            <li>Resim hakkı</li>
            <li>Özel yaşamın gizliliği</li>
            <li>Şeref ve haysiyet</li>
          </ul>
        `
      }
    ]
  }
];

// LocalStorage'a kaydet
function addSampleLessons() {
  try {
    localStorage.setItem('proSınav_subjects', JSON.stringify(sampleSubjects));
    console.log('✅ Örnek ders verileri başarıyla eklendi!');
    console.log('Eklenen dersler:', sampleSubjects.map(s => s.name).join(', '));
    
    // Sayfayı yenile
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  } catch (error) {
    console.error('❌ Ders verileri eklenirken hata:', error);
  }
}

// Eğer browser ortamındaysa çalıştır
if (typeof window !== 'undefined') {
  addSampleLessons();
}

// Node.js için export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { sampleSubjects, addSampleLessons };
}