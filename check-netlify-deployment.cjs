// Netlify deployment durumunu kontrol etme scripti
const https = require('https');

console.log('🔍 Netlify deployment durumu kontrol ediliyor...');

// Netlify sitesinin durumunu kontrol et
function checkSiteStatus() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'sinavmisyon.netlify.app',
      port: 443,
      path: '/',
      method: 'HEAD',
      timeout: 10000
    };

    const req = https.request(options, (res) => {
      console.log('📊 Site Status Code:', res.statusCode);
      console.log('📋 Response Headers:', JSON.stringify(res.headers, null, 2));
      
      if (res.statusCode === 200) {
        console.log('✅ Site erişilebilir durumda');
        resolve({ status: 'online', statusCode: res.statusCode });
      } else if (res.statusCode === 404) {
        console.log('❌ Site bulunamadı (404) - Deployment sorunu olabilir');
        resolve({ status: 'not_found', statusCode: res.statusCode });
      } else {
        console.log('⚠️ Site erişilebilir ama beklenmeyen status code:', res.statusCode);
        resolve({ status: 'unexpected', statusCode: res.statusCode });
      }
    });

    req.on('error', (error) => {
      console.error('❌ Site erişim hatası:', error.message);
      reject(error);
    });

    req.on('timeout', () => {
      console.error('⏰ Site erişim zaman aşımı');
      req.destroy();
      reject(new Error('Timeout'));
    });

    req.end();
  });
}

// Ana kontrol fonksiyonu
async function checkDeployment() {
  try {
    console.log('🌐 Site durumu kontrol ediliyor...');
    const siteStatus = await checkSiteStatus();
    
    console.log('\n📋 DURUM RAPORU:');
    console.log('================');
    console.log('Site URL: https://sinavmisyon.netlify.app/');
    console.log('Durum:', siteStatus.status);
    console.log('HTTP Status Code:', siteStatus.statusCode);
    
    if (siteStatus.status === 'not_found') {
      console.log('\n🔧 ÖNERİLEN ÇÖZÜMLER:');
      console.log('1. Netlify dashboard\'ında deployment loglarını kontrol edin');
      console.log('2. Build sürecinin başarılı olduğunu doğrulayın');
      console.log('3. GitHub-Netlify bağlantısının aktif olduğunu kontrol edin');
      console.log('4. Manuel deploy tetikleyin');
      console.log('5. Site ayarlarında publish directory\'nin "dist" olduğunu doğrulayın');
    } else if (siteStatus.status === 'online') {
      console.log('\n✅ Site normal çalışıyor, başka bir sorun olabilir');
    }
    
    console.log('\n🔗 Faydalı Linkler:');
    console.log('- Netlify Dashboard: https://app.netlify.com/');
    console.log('- GitHub Repository: https://github.com/mslmkck/misyon');
    
  } catch (error) {
    console.error('\n❌ Kontrol sırasında hata oluştu:', error.message);
  }
}

// Scripti çalıştır
checkDeployment();