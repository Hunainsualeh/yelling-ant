const http = require('http');

const ads = [
    {
        name: 'Sidebar Ad - Tech Gear',
        brand: 'TechStore',
        status: 'active',
        slot: 'sidebar',
        content: {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=300&h=250&fit=crop',
            link: 'https://example.com/tech',
            headline: 'Upgrade Your Setup',
            description: 'Best deals on tech gear.'
        }
    },
    {
        name: 'Quiz Main Ad - Coffee',
        brand: 'BrewMaster',
        status: 'active',
        slot: 'quiz-main',
        content: {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=200&fit=crop',
            link: 'https://example.com/coffee',
            headline: 'Wake Up with BrewMaster',
            description: 'Premium coffee beans delivered.'
        }
    },
    {
        name: 'Quiz Result Ad - Travel',
        brand: 'Wanderlust',
        status: 'active',
        slot: 'quiz-result',
        content: {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&h=400&fit=crop',
            link: 'https://example.com/travel',
            headline: 'Plan Your Next Adventure',
            description: 'Exclusive travel packages.'
        }
    },
    {
        name: 'Home Feed 1 - Fashion',
        brand: 'StyleIcon',
        status: 'active',
        slot: 'YA_QHOME_FEED_001',
        content: {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=300&fit=crop',
            link: 'https://example.com/fashion',
            headline: 'Summer Collection',
            description: 'New arrivals are here.'
        }
    },
    {
        name: 'Home Feed 2 - Fitness',
        brand: 'FitLife',
        status: 'active',
        slot: 'YA_QHOME_FEED_002',
        content: {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=300&fit=crop',
            link: 'https://example.com/fitness',
            headline: 'Get Fit Today',
            description: 'Join our gym now.'
        }
    },
    {
        name: 'Home Feed 3 - Food',
        brand: 'TastyBites',
        status: 'active',
        slot: 'YA_QHOME_FEED_003',
        content: {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=300&fit=crop',
            link: 'https://example.com/food',
            headline: 'Delicious Recipes',
            description: 'Cook like a pro.'
        }
    },
    {
        name: 'Home Top - Streaming',
        brand: 'StreamPlus',
        status: 'active',
        slot: 'YA_QHOME_TOP_001',
        content: {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=1200&h=200&fit=crop',
            link: 'https://example.com/stream',
            headline: 'Watch Anywhere',
            description: 'Unlimited movies and TV shows.'
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
                'Authorization': 'Bearer ayW1YVN3g72H', // Assuming this token is still valid/needed or ignored by dev backend
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

        req.on('error', (e) => {
            reject(e);
        });

        req.write(data);
        req.end();
    });
}

async function main() {
    console.log('Starting to populate ads...');
    for (const ad of ads) {
        try {
            const result = await createAd(ad);
            console.log(`[${ad.slot}] ${ad.name}: ${result.status === 201 ? 'Created' : 'Failed (' + result.status + ')'}`);
            if (result.status !== 201) {
                console.error('Error details:', result.data);
            }
        } catch (error) {
            console.error(`[${ad.slot}] ${ad.name}: Error -`, error);
        }
    }
    console.log('Done.');
}

main();
