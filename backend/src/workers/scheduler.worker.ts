import { query } from '../config/database';

async function publishScheduledQuizzes() {
  try {
    const now = new Date();
    const res = await query(
      `SELECT id, slug FROM quizzes WHERE status = 'scheduled' AND published_at <= $1`,
      [now]
    );

    if (res.rows.length === 0) {
      console.log(new Date().toISOString(), 'No scheduled quizzes to publish');
      return;
    }

    for (const row of res.rows) {
      try {
        const update = await query(
          `UPDATE quizzes SET status='published', updated_at=$1 WHERE id=$2 RETURNING id, slug, published_at`,
          [new Date(), row.id]
        );
        console.log(new Date().toISOString(), 'Published quiz', update.rows[0].slug);
      } catch (err) {
        console.error('Error publishing quiz', row.slug, err);
      }
    }
  } catch (err) {
    console.error('Scheduler error', err);
  }
}

// If run directly, start interval loop
if (require.main === module) {
  console.log('Scheduler worker started — will check every 5 minutes');
  // Run immediately then every 5 minutes
  publishScheduledQuizzes();
  setInterval(publishScheduledQuizzes, 5 * 60 * 1000);
}

export { publishScheduledQuizzes };

