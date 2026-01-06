const { Pool } = require('./backend/node_modules/pg');

const connectionString = 'postgresql://yellingant_user:fqLg1iatFEmowxPpmhNRgslE@62.169.27.195:5432/yellingAnt';

const pool = new Pool({
  connectionString,
});

async function main() {
  try {
    console.log('Connecting to DB...');
    const client = await pool.connect();
    console.log('Connected!');

    // Check Quizzes
    console.log('\nChecking Quizzes...');
    const quizzes = await client.query('SELECT title, slug, published FROM quizzes WHERE title = $1', ['Build Your Dream Vacation']);
    if (quizzes.rows.length > 0) {
      console.log('✅ Found quiz: "Build Your Dream Vacation"');
      console.log('   Published:', quizzes.rows[0].published);
    } else {
      console.log('❌ Quiz "Build Your Dream Vacation" NOT found.');
    }

    // Check Ops/Ads
    console.log('\nChecking Ads...');
    // Assuming ads table name is 'ads'. 
    // I should check if table exists first basically.
    const adsTable = await client.query("SELECT to_regclass('public.ads')");
    if (adsTable.rows[0].to_regclass) {
        const ads = await client.query('SELECT name, slot FROM ads');
        console.log(`Found ${ads.rows.length} ads.`);
        ads.rows.forEach(ad => console.log(`- ${ad.name} (${ad.slot})`));
    } else {
        console.log('❌ Ads table does not exist.');
    }

    client.release();
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
}

main();
