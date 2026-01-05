const http = require('http');

const testAd = {
  name: 'Test Sidebar Ad',
  brand: 'Test Brand',
  status: 'active',
  slot: 'sidebar',
  content: {
    type: 'image',
    url: 'https://images.unsplash.com/photo-1461896836934-28f4f72f2d9b?w=245&h=296&fit=crop',
    link: 'https://example.com'
  }
};

const data = JSON.stringify(testAd);

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/ads',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

console.log('Creating test ad...');
console.log('Payload:', testAd);

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('\nResponse Status:', res.statusCode);
    console.log('Response Body:', body);
    
    if (res.statusCode === 201) {
      console.log('\n✅ Ad created successfully!');
      console.log('\nNow fetching all ads...');
      
      // Fetch all ads
      http.get('http://localhost:5000/api/ads', (getRes) => {
        let adsBody = '';
        getRes.on('data', (chunk) => adsBody += chunk);
        getRes.on('end', () => {
          console.log('All ads:', JSON.stringify(JSON.parse(adsBody), null, 2));
        });
      });
    } else {
      console.log('\n❌ Failed to create ad');
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Error:', e.message);
});

req.write(data);
req.end();
