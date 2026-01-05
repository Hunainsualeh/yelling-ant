const http = require('http');

const ads = [
  {
    name: "Sidebar Ad 1 - Sports App",
    brand: "ESPN",
    status: "active",
    slot: "sidebar",
    content: {
      type: "image",
      url: "https://images.unsplash.com/photo-1461896836934-28f4f72f2d9b?w=245&h=296&fit=crop",
      link: "https://espn.com"
    }
  },
  {
    name: "Sidebar Ad 2 - Gaming",
    brand: "Xbox",
    status: "active",
    slot: "sidebar",
    content: {
      type: "image",
      url: "https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=245&h=318&fit=crop",
      link: "https://xbox.com"
    }
  },
  {
    name: "Quiz Main Ad - Salon",
    brand: "Great Nature Salon",
    status: "active",
    slot: "quiz-main",
    content: {
      type: "image",
      url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=150&fit=crop",
      link: "https://example.com/salon"
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
      res.on('end', () => resolve({ status: res.statusCode, data: body }));
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('Creating sidebar and quiz ads...\n');
  for (const ad of ads) {
    try {
      const r = await createAd(ad);
      console.log(`${ad.name} (${ad.slot}): ${r.status === 201 ? 'Created!' : 'Failed - ' + r.data}`);
    } catch (e) {
      console.log(`${ad.name}: Error - ${e.message}`);
    }
  }
  console.log('\nDone!');
}

main();
