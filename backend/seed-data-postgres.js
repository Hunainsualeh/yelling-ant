// Seed sample quizzes to PostgreSQL
const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5434,
  database: 'Quizbuzz',
  user: 'postgres',
  password: 'fast12345',
});

const sampleQuizzes = [
  {
    slug: 'which-brown-auntie-are-you',
    title: 'Which Brown Auntie Energy Are You?',
    description: 'Discover which type of Brown Auntie matches your personality!',
    type: 'personality',
    status: 'published',
    quiz_data: {
      metadata: {
        estimatedTime: 3,
        difficulty: 'easy',
        category: 'personality',
        tags: ['culture', 'humor', 'personality'],
        author: 'Yelling Ant Team',
        featured: true,
      },
      theme: {
        primaryColor: '#FF6B9D',
        secondaryColor: '#FFA07A',
        fontFamily: 'Inter',
      },
      questions: [
        {
          id: 'q1',
          type: 'single-choice',
          text: 'How do you greet guests at your home?',
          options: [
            {
              id: 'q1-opt1',
              text: 'Force-feed them until they can\'t move',
              weight: { 'foodie-auntie': 3, 'gossip-auntie': 0, 'doctor-auntie': 1 },
            },
            {
              id: 'q1-opt2',
              text: 'Ask about their salary and marriage plans',
              weight: { 'foodie-auntie': 0, 'gossip-auntie': 3, 'doctor-auntie': 1 },
            },
            {
              id: 'q1-opt3',
              text: 'Check their temperature and ask about ailments',
              weight: { 'foodie-auntie': 0, 'gossip-auntie': 1, 'doctor-auntie': 3 },
            },
          ],
        },
        {
          id: 'q2',
          type: 'single-choice',
          text: 'What\'s your go-to conversation starter?',
          options: [
            {
              id: 'q2-opt1',
              text: 'Did you hear what happened to Sharma ji\'s son?',
              weight: { 'foodie-auntie': 0, 'gossip-auntie': 3, 'doctor-auntie': 0 },
            },
            {
              id: 'q2-opt2',
              text: 'Try this recipe I just made!',
              weight: { 'foodie-auntie': 3, 'gossip-auntie': 0, 'doctor-auntie': 0 },
            },
            {
              id: 'q2-opt3',
              text: 'Are you taking your vitamins regularly?',
              weight: { 'foodie-auntie': 0, 'gossip-auntie': 0, 'doctor-auntie': 3 },
            },
          ],
        },
      ],
      results: {
        'foodie-auntie': {
          title: 'The Foodie Auntie',
          description: 'You believe food is love, and no one leaves your house hungry!',
          imageUrl: 'https://via.placeholder.com/600x400/FF6B9D/FFFFFF?text=Foodie+Auntie',
        },
        'gossip-auntie': {
          title: 'The Gossip Queen Auntie',
          description: 'You know everyone\'s business and love sharing "concerns" about others.',
          imageUrl: 'https://via.placeholder.com/600x400/FFA07A/FFFFFF?text=Gossip+Auntie',
        },
        'doctor-auntie': {
          title: 'The Doctor Auntie',
          description: 'You have a remedy for everything and everyone\'s health is your priority!',
          imageUrl: 'https://via.placeholder.com/600x400/87CEEB/FFFFFF?text=Doctor+Auntie',
        },
      },
    },
  },
  {
    slug: 'black-history-trivia',
    title: 'How Well Do You Know Black History?',
    description: 'Test your knowledge of Black History Month facts!',
    type: 'trivia',
    status: 'published',
    quiz_data: {
      metadata: {
        estimatedTime: 5,
        difficulty: 'medium',
        category: 'education',
        tags: ['history', 'education', 'culture'],
        author: 'Yelling Ant Team',
        featured: true,
      },
      theme: {
        primaryColor: '#2C3E50',
        secondaryColor: '#E74C3C',
        fontFamily: 'Georgia',
      },
      questions: [
        {
          id: 'q1',
          type: 'single-choice',
          text: 'Who was the first African American Supreme Court Justice?',
          explanation: 'Thurgood Marshall was appointed in 1967.',
          options: [
            { id: 'opt1', text: 'Thurgood Marshall', isCorrect: true },
            { id: 'opt2', text: 'Clarence Thomas', isCorrect: false },
            { id: 'opt3', text: 'Earl Warren', isCorrect: false },
          ],
        },
        {
          id: 'q2',
          type: 'single-choice',
          text: 'In what year did Rosa Parks refuse to give up her bus seat?',
          explanation: 'This happened on December 1, 1955, in Montgomery, Alabama.',
          options: [
            { id: 'opt1', text: '1955', isCorrect: true },
            { id: 'opt2', text: '1963', isCorrect: false },
            { id: 'opt3', text: '1968', isCorrect: false },
          ],
        },
      ],
      results: {
        'expert': {
          title: 'History Expert!',
          description: 'You aced it! Your knowledge of Black History is impressive.',
          minScore: 80,
          maxScore: 100,
        },
        'good': {
          title: 'Good Job!',
          description: 'You know your history pretty well!',
          minScore: 50,
          maxScore: 79,
        },
        'keep-learning': {
          title: 'Keep Learning!',
          description: 'There\'s always more to discover about Black History!',
          minScore: 0,
          maxScore: 49,
        },
      },
    },
  },
];

async function seedDatabase() {
  try {
    console.log('[INFO] Connecting to PostgreSQL...');
    await client.connect();
    console.log('[SUCCESS] Connected to PostgreSQL');

    console.log('[INFO] Clearing existing quizzes...');
    await client.query('DELETE FROM quizzes');

    console.log('[INFO] Inserting sample quizzes...');
    for (const quiz of sampleQuizzes) {
      await client.query(
        `INSERT INTO quizzes (slug, title, quiz_data, status, created_at, updated_at)
         VALUES ($1, $2, $3, $4, NOW(), NOW())`,
        [quiz.slug, quiz.title, JSON.stringify(quiz.quiz_data), quiz.status]
      );
    }

    console.log('[SUCCESS] Successfully inserted', sampleQuizzes.length, 'quizzes');
    console.log('');
    console.log('Sample quizzes:');
    sampleQuizzes.forEach((quiz) => {
      console.log(`  - ${quiz.title} (${quiz.slug})`);
    });

    await client.end();
    process.exit(0);
  } catch (error) {
    console.error('[ERROR] Error seeding database:', error);
    await client.end();
    process.exit(1);
  }
}

seedDatabase();
