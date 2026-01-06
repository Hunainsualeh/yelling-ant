const https = require('https');

const URL = 'https://quiz-backend.brewly.ae/api/ads?status=active';
const THRESHOLD = 200000; // bytes

https.get(URL, (res) => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    try {
      const ads = JSON.parse(d);
      const large = ads.filter(a => a.content && a.content.url && a.content.url.length > THRESHOLD);
      if (large.length === 0) {
        console.log('No oversized ads found');
        return;
      }
      console.log('Oversized ads found:');
      large.forEach(a => {
        console.log('-', a.id, '|', a.name, '|', (a.content.url.length/1024).toFixed(1) + ' KB', '| slot:', a.slot);
      });
      console.log('\nRecommendation: delete or update these ads via the admin UI, or upload images via /api/admin/upload and set content.url to the uploaded file url.');
    } catch (e) {
      console.error('Failed to parse response', e.message);
      console.log(d.slice(0, 2000));
    }
  });
}).on('error', e => console.error('Request error', e));
