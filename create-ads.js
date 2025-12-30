const http = require('http');

const ads = [
  {
    name: "Nike Summer Sale",
    brand: "Nike",
    status: "active",
    slot: "YA_QHOME_FEED_001",
    content: {
      type: "image",
      url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=236&fit=crop",
      link: "https://nike.com",
      alt: "Nike Summer Sale - Up to 50% off"
    }
  },
  {
    name: "Apple iPhone 15",
    brand: "Apple",
    status: "active",
    slot: "YA_QHOME_FEED_002",
    content: {
      type: "image",
      url: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&h=174&fit=crop",
      link: "https://apple.com/iphone",
      alt: "iPhone 15 - Now Available"
    }
  },
  {
    name: "Spotify Premium",
    brand: "Spotify",
    status: "active",
    slot: "YA_QHOME_FEED_003",
    content: {
      type: "image",
      url: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=800&h=266&fit=crop",
      link: "https://spotify.com/premium",
      alt: "Spotify Premium - 3 Months Free"
    }
  },
  {
    name: "Netflix New Shows",
    brand: "Netflix",
    status: "active",
    slot: "YA_QHOME_TOP_001",
    content: {
      type: "image",
      url: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=1200&h=300&fit=crop",
      link: "https://netflix.com",
      alt: "Netflix - New Shows This Month"
    }
  },
  {
    name: "Amazon Prime Day",
    brand: "Amazon",
    status: "active",
    slot: "quiz_sidebar",
    content: {
      type: "image",
      url: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=300&h=600&fit=crop",
      link: "https://amazon.com/primeday",
      alt: "Amazon Prime Day - Huge Savings"
    }
  }
];

async function createAd(ad) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(ad);
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/ads',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ayW1YVN3g72H',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, data: body });
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('Creating test ads for all slots...\n');

  for (const ad of ads) {
    try {
      const result = await createAd(ad);
      console.log(`${ad.name} (${ad.slot}): ${result.status === 201 ? 'Created!' : 'Failed: ' + result.data}`);
    } catch (e) {
      console.log(`${ad.name}: Error - ${e.message}`);
    }
  }

  console.log('\nDone! Fetching all ads...\n');

  // Fetch all ads
  const http = require('http');
  http.get('http://localhost:5000/api/ads', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const ads = JSON.parse(data);
        console.log(`Total ads: ${ads.length}`);
        ads.forEach(a => console.log(`- ${a.name} | ${a.slot} | ${a.status}`));
      } catch (e) {
        console.log('Response:', data);
      }
    });
  });
}

main();
