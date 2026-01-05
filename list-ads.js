const http = require('http');

http.get('http://localhost:5000/api/ads', (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        try {
            const ads = JSON.parse(data);
            console.log('Total ads:', ads.length);
            ads.forEach(ad => {
                console.log(`[${ad.slot}] ${ad.name} (Link: ${ad.content.link})`);
            });
        } catch (e) {
            console.error('Error parsing JSON:', e);
            console.log('Raw data:', data);
        }
    });
}).on('error', (err) => {
    console.error('Error:', err.message);
});
