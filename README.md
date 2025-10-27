# Komiser Yardımcılığı Hazırlık Platformu

Bu proje, komiser yardımcılığı sınavına hazırlanan adaylar için geliştirilmiş modern bir eğitim platformudur.

## Özellikler

- 📚 **Ders İçerikleri**: Anayasa Hukuku, İdare Hukuku, Ceza Hukuku ve daha fazlası
- ❓ **Soru Bankası**: Konulara göre kategorize edilmiş sorular
- 📝 **Deneme Sınavları**: Gerçek sınav formatında mock sınavlar
- 🎯 **Flashcard'lar**: Hızlı tekrar için kart sistemi
- 📊 **İstatistikler**: Performans takibi ve analiz
- 📢 **Duyurular**: Admin tarafından yönetilen duyuru sistemi
- 👤 **Kullanıcı Yönetimi**: Kayıt, giriş ve profil yönetimi

## Teknolojiler

- **Frontend**: React 19, TypeScript, Vite
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Custom SVG icon set

## Kurulum

### Gereksinimler

- Node.js 18+ 
- npm veya yarn
- Supabase hesabı

### Adımlar

1. **Projeyi klonlayın**
   ```bash
   git clone <repository-url>
   cd misyon
   ```

2. **Bağımlılıkları yükleyin**
   ```bash
   npm install
   ```

3. **Environment değişkenlerini ayarlayın**
   ```bash
   cp .env.example .env
   ```
   
   `.env` dosyasını düzenleyerek Supabase bilgilerinizi ekleyin:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. **Supabase veritabanını kurun**
   ```bash
   node setup-supabase-direct.js
   ```

5. **Geliştirme sunucusunu başlatın**
   ```bash
   npm run dev
   ```

## Build ve Deployment

### Production Build

```bash
npm run build
```

Build edilen dosyalar `dist/` klasöründe oluşturulur.

### Preview

Build edilen projeyi test etmek için:

```bash
npm run preview
```

### Deployment Seçenekleri

#### Vercel
1. Vercel hesabınıza giriş yapın
2. Projeyi import edin
3. Environment değişkenlerini ekleyin
4. Deploy edin

#### Netlify
1. `dist/` klasörünü Netlify'a yükleyin
2. Environment değişkenlerini ayarlayın
3. Deploy edin

#### Diğer Hosting Servisleri
`dist/` klasöründeki statik dosyaları herhangi bir web sunucusuna yükleyebilirsiniz.

## Veritabanı Yapısı

Proje aşağıdaki ana tablolara sahiptir:

- `subjects`: Ders konuları
- `topics`: Konu başlıkları
- `questions`: Sorular
- `quiz_tests`: Test setleri
- `mock_exams`: Deneme sınavları
- `flashcards`: Flashcard'lar
- `announcements`: Duyurular
- `user_profiles`: Kullanıcı profilleri
- `quiz_sessions`: Sınav oturumları
- `user_answers`: Kullanıcı cevapları

## Admin Paneli

Admin paneline erişim için:

1. Kullanıcı kaydı yapın
2. Supabase dashboard'unda `user_profiles` tablosunda `is_admin` değerini `true` yapın
3. Uygulamada "Admin" butonuna tıklayın

Admin panelinde şunları yapabilirsiniz:
- Duyuru ekleme/düzenleme/silme
- Ders içerikleri yönetimi
- Soru bankası yönetimi
- Kullanıcı istatistikleri

## Geliştirme

### Proje Yapısı

```
src/
├── components/          # Yeniden kullanılabilir bileşenler
├── pages/              # Sayfa bileşenleri
├── lib/                # Yardımcı kütüphaneler
├── types.ts            # TypeScript tip tanımları
└── constants.ts        # Sabit değerler
```

### Kod Standartları

- TypeScript kullanın
- Functional component'ler tercih edin
- Props için interface tanımlayın
- Responsive tasarım uygulayın

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add some amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## Destek

Herhangi bir sorun yaşarsanız, lütfen GitHub Issues bölümünde bir konu açın.