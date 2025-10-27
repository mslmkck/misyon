# Vercel Deployment Rehberi

## 🚀 Vercel'e Deployment Adımları

### 1. Vercel Hesabı Oluşturma
1. [vercel.com](https://vercel.com) adresine gidin
2. "Sign Up" butonuna tıklayın
3. GitHub hesabınızla giriş yapın

### 2. Projeyi Vercel'e Import Etme
1. Vercel dashboard'ında "New Project" butonuna tıklayın
2. GitHub'dan `mslmkck/misyon` repository'sini seçin
3. "Import" butonuna tıklayın

### 3. Build Ayarları
Vercel otomatik olarak şu ayarları algılayacak:
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### 4. Environment Variables Ekleme
Deployment sırasında veya sonrasında şu environment variables'ları ekleyin:

```
VITE_SUPABASE_URL=https://qdyezbtbmkwibedukdml.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkeWV6YnRibWt3aWJlZHVrZG1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1MjAzMzksImV4cCI6MjA3NzA5NjMzOX0.rV6fN5l6RCcWL9C6_xxtwyl80q3L0aHs_ElQtggzc28
```

**Not:** Service role key'i production'da kullanmayın, sadece development için gerekli.

### 5. Deploy Etme
1. "Deploy" butonuna tıklayın
2. Build sürecini bekleyin (yaklaşık 1-2 dakika)
3. Deployment tamamlandığında site URL'i verilecek

### 6. Domain Ayarları (Opsiyonel)
- Vercel otomatik olarak `your-project-name.vercel.app` domain'i verir
- Custom domain eklemek için "Settings" > "Domains" bölümünden yapabilirsiniz

## 🔧 Vercel.json Konfigürasyonu

Projede `vercel.json` dosyası oluşturuldu. Bu dosya:
- SPA routing için gerekli redirects'i sağlar
- Build ayarlarını optimize eder
- Environment variables'ları tanımlar

## 📋 Deployment Sonrası Kontroller

1. **Site erişimi:** Vercel URL'ine giderek sitenin açıldığını kontrol edin
2. **Supabase bağlantısı:** Login/register işlemlerinin çalıştığını test edin
3. **Admin paneli:** Admin hesabıyla giriş yaparak admin panelinin çalıştığını kontrol edin

## 🔄 Otomatik Deployment

Vercel, GitHub repository'sindeki her push'ta otomatik olarak yeniden deploy eder:
- `master` branch'e push → Production deployment
- Diğer branch'lere push → Preview deployment

## 🆘 Sorun Giderme

### Build Hatası
- Vercel dashboard'ında "Functions" sekmesinden build loglarını kontrol edin
- Environment variables'ların doğru eklendiğini kontrol edin

### Site Açılmıyor
- Browser cache'ini temizleyin
- Vercel dashboard'ında deployment status'unu kontrol edin

### Supabase Bağlantı Sorunu
- Environment variables'ların doğru olduğunu kontrol edin
- Supabase project'inin aktif olduğunu kontrol edin

## 🔗 Faydalı Linkler

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Repository](https://github.com/mslmkck/misyon)
- [Supabase Dashboard](https://supabase.com/dashboard)

## 📝 Notlar

- Vercel ücretsiz plan ile aylık 100GB bandwidth ve unlimited deployments
- Build süreleri genellikle 1-3 dakika arası
- Automatic HTTPS ve global CDN dahil
- Preview deployments her PR için otomatik oluşturulur