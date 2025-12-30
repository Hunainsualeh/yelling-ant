const http = require('http');

const AUTH = 'Bearer ayW1YVN3g72H';

function makeRequest(method, path, body = null, auth = false) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: { 'Content-Type': 'application/json' }
    };
    if (auth) options.headers['Authorization'] = AUTH;
    if (body) options.headers['Content-Length'] = Buffer.byteLength(body);

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, data: data });
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function testAPI(name, method, path, body = null, auth = false) {
  try {
    const result = await makeRequest(method, path, body ? JSON.stringify(body) : null, auth);
    const status = result.status < 400 ? '✅' : '❌';
    console.log(`${status} ${name}: ${result.status}`);
    return result;
  } catch (e) {
    console.log(`❌ ${name}: ${e.message}`);
    return null;
  }
}

async function main() {
  console.log('========================================');
  console.log('       QuizBuzz API Test Suite');
  console.log('========================================\n');

  console.log('--- Health & Public Endpoints ---');
  await testAPI('Health Check', 'GET', '/health');
  await testAPI('Public Quiz List', 'GET', '/api/quiz');
  await testAPI('Quiz by Category (Personality)', 'GET', '/api/quiz?category=Personality');
  await testAPI('Quiz by Category (Movies)', 'GET', '/api/quiz?category=Movies');

  console.log('\n--- Admin Quiz Endpoints ---');
  await testAPI('Admin Quiz List (no auth)', 'GET', '/api/admin/quiz');
  await testAPI('Admin Quiz List (with auth)', 'GET', '/api/admin/quiz', null, true);

  console.log('\n--- Ads Endpoints ---');
  await testAPI('Get All Ads', 'GET', '/api/ads');
  await testAPI('Get Ads by Slot (FEED_001)', 'GET', '/api/ads?slot=YA_QHOME_FEED_001');
  await testAPI('Get Ads by Slot (FEED_002)', 'GET', '/api/ads?slot=YA_QHOME_FEED_002');
  await testAPI('Get Ads by Slot (FEED_003)', 'GET', '/api/ads?slot=YA_QHOME_FEED_003');
  await testAPI('Get Ads by Slot (TOP_001)', 'GET', '/api/ads?slot=YA_QHOME_TOP_001');

  console.log('\n--- Quiz Detail Endpoints ---');
  const quizList = await makeRequest('GET', '/api/quiz');
  try {
    const quizzes = JSON.parse(quizList.data).quizzes;
    if (quizzes && quizzes.length > 0) {
      const slug = quizzes[0].slug;
      await testAPI(`Get Quiz: ${slug}`, 'GET', `/api/quiz/${slug}`);
    }
  } catch (e) {}

  console.log('\n========================================');
  console.log('           Test Complete!');
  console.log('========================================');
}

main();
