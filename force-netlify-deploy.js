// Netlify Build Hook ile manuel deploy tetikleme
// Bu script Netlify'da yeni bir deploy başlatır

const https = require('https');

// Netlify Build Hook URL'i (gerçek URL'i buraya ekleyin)
const BUILD_HOOK_URL = 'https://api.netlify.com/build_hooks/YOUR_BUILD_HOOK_ID';

console.log('🚀 Netlify manual deploy başlatılıyor...');
console.log('📍 Build Hook URL:', BUILD_HOOK_URL);

// POST request gönder
const postData = JSON.stringify({
  trigger_branch: 'master',
  trigger_title: 'Manual deploy from script'
});

const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = https.request(BUILD_HOOK_URL, options, (res) => {
  console.log('📊 Response Status:', res.statusCode);
  console.log('📋 Response Headers:', res.headers);

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 200 || res.statusCode === 201) {
      console.log('✅ Deploy başarıyla tetiklendi!');
      console.log('📄 Response:', data);
      console.log('🔗 Netlify dashboard\'ı kontrol edin: https://app.netlify.com/');
    } else {
      console.log('❌ Deploy tetiklenemedi');
      console.log('📄 Response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Hata:', error.message);
  console.log('💡 Build Hook URL\'ini kontrol edin ve doğru olduğundan emin olun');
});

req.write(postData);
req.end();

console.log('⏳ Deploy isteği gönderildi, yanıt bekleniyor...');