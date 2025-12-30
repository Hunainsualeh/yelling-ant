const http = require('http');

const quizzes = [
  {
    title: "Which Disney Princess Are You?",
    slug: "disney-princess-personality",
    type: "personality",
    primary_colony: "Personality",
    tags: ["personality", "disney"],
    hero_image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800",
    questions: [{ id: "q1", text: "How would friends describe you?", type: "single", options: [{ id: "a", text: "Brave", map: { Merida: 3 } }, { id: "b", text: "Kind", map: { Cinderella: 3 } }] }],
    results: { Merida: { title: "Merida", description: "Brave!" }, Cinderella: { title: "Cinderella", description: "Kind!" } }
  },
  {
    title: "What's Your Love Language?",
    slug: "love-language-quiz",
    type: "personality",
    primary_colony: "Love",
    tags: ["love", "relationships"],
    hero_image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800",
    questions: [{ id: "q1", text: "Your partner had a rough day. What do you do?", type: "single", options: [{ id: "a", text: "Hug them", map: { Physical_Touch: 3 } }, { id: "b", text: "Tell them you love them", map: { Words: 3 } }] }],
    results: { Physical_Touch: { title: "Physical Touch", description: "Hugs!" }, Words: { title: "Words", description: "Words!" } }
  },
  {
    title: "Which Pop Star Are You?",
    slug: "pop-star-quiz",
    type: "personality",
    primary_colony: "Pop Celebrity",
    tags: ["celebrity", "music"],
    hero_image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
    questions: [{ id: "q1", text: "Your concert outfit?", type: "single", options: [{ id: "a", text: "Sparkly", map: { Beyonce: 3 } }, { id: "b", text: "Casual", map: { Taylor: 3 } }] }],
    results: { Beyonce: { title: "Beyoncé", description: "Queen!" }, Taylor: { title: "Taylor Swift", description: "Relatable!" } }
  },
  {
    title: "Ultimate Movie Trivia",
    slug: "movie-trivia-quiz",
    type: "trivia",
    primary_colony: "Movies",
    tags: ["movies", "trivia"],
    hero_image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800",
    questions: [{ id: "q1", text: "Best Picture 2020?", type: "single", options: [{ id: "a", text: "1917", correct: false }, { id: "b", text: "Parasite", correct: true }] }],
    results: { high: { title: "Movie Buff!", description: "Great!" }, low: { title: "Watch more!", description: "Try again!" } }
  },
  {
    title: "What's Your Food Personality?",
    slug: "food-personality-quiz",
    type: "personality",
    primary_colony: "Food",
    tags: ["food", "personality"],
    hero_image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
    questions: [{ id: "q1", text: "Friday night food?", type: "single", options: [{ id: "a", text: "Homemade pasta", map: { Chef: 3 } }, { id: "b", text: "New restaurant", map: { Foodie: 3 } }] }],
    results: { Chef: { title: "The Chef", description: "Cook!" }, Foodie: { title: "The Foodie", description: "Explore!" } }
  },
  {
    title: "What's Your Aesthetic?",
    slug: "aesthetic-quiz",
    type: "personality",
    primary_colony: "Aesthetics",
    tags: ["aesthetics", "style"],
    hero_image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
    questions: [{ id: "q1", text: "Dream bedroom?", type: "single", options: [{ id: "a", text: "Minimalist", map: { Minimal: 3 } }, { id: "b", text: "Cozy", map: { Cottage: 3 } }] }],
    results: { Minimal: { title: "Minimalist", description: "Clean!" }, Cottage: { title: "Cottagecore", description: "Cozy!" } }
  },
  {
    title: "General Knowledge Challenge",
    slug: "general-knowledge-quiz",
    type: "points",
    primary_colony: "General Knowledge",
    tags: ["trivia", "knowledge"],
    hero_image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800",
    questions: [{ id: "q1", text: "Capital of Australia?", type: "single", points: 10, options: [{ id: "a", text: "Sydney", correct: false }, { id: "b", text: "Canberra", correct: true }] }],
    results: { high: { title: "Genius!", description: "Great!", min_score: 80 }, low: { title: "Learn more!", description: "Try again!", min_score: 0 } }
  },
  {
    title: "TV Shows Personality Match",
    slug: "tv-show-personality-quiz",
    type: "personality",
    primary_colony: "Entertainment",
    tags: ["tv", "entertainment"],
    hero_image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800",
    questions: [{ id: "q1", text: "Rainy Sunday?", type: "single", options: [{ id: "a", text: "Binge-watch", map: { Office: 3 } }, { id: "b", text: "Puzzles", map: { Sherlock: 3 } }] }],
    results: { Office: { title: "The Office", description: "Funny!" }, Sherlock: { title: "Sherlock", description: "Clever!" } }
  },
  {
    title: "Self-Care Style Quiz",
    slug: "self-care-style-quiz",
    type: "personality",
    primary_colony: "Lifestyle",
    tags: ["lifestyle", "wellness"],
    hero_image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
    questions: [{ id: "q1", text: "After stress?", type: "single", options: [{ id: "a", text: "Workout", map: { Active: 3 } }, { id: "b", text: "Spa day", map: { Pamper: 3 } }] }],
    results: { Active: { title: "Active Recharger", description: "Move!" }, Pamper: { title: "Pamper Pro", description: "Relax!" } }
  },
  {
    title: "Space Exploration Trivia",
    slug: "space-trivia-quiz",
    type: "trivia",
    primary_colony: "Science",
    tags: ["science", "space"],
    hero_image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800",
    questions: [{ id: "q1", text: "First Mars lander?", type: "single", options: [{ id: "a", text: "Viking 1", correct: true }, { id: "b", text: "Spirit", correct: false }] }],
    results: { high: { title: "Space Expert!", description: "NASA material!" }, low: { title: "Earth Dweller", description: "Look up!" } }
  },
  {
    title: "Ultimate Sports Trivia",
    slug: "sports-trivia-quiz",
    type: "trivia",
    primary_colony: "Sports",
    tags: ["sports", "trivia"],
    hero_image: "https://images.unsplash.com/photo-1461896836934-28f4f72f2d9b?w=800",
    questions: [{ id: "q1", text: "Most World Cups?", type: "single", options: [{ id: "a", text: "Germany", correct: false }, { id: "b", text: "Brazil", correct: true }] }],
    results: { high: { title: "Sports Fanatic!", description: "Wow!" }, low: { title: "Bench Warmer", description: "Watch more!" } }
  }
];

async function createQuiz(quiz) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(quiz);
    const options = {
      hostname: 'localhost', port: 5000, path: '/api/admin/quiz', method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ayW1YVN3g72H', 'Content-Length': Buffer.byteLength(data) }
    };
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data: body, title: quiz.title }));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function publishQuiz(slug) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ publish: true });
    const options = {
      hostname: 'localhost', port: 5000, path: `/api/admin/quiz/${slug}/publish`, method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ayW1YVN3g72H', 'Content-Length': Buffer.byteLength(data) }
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
  console.log('Creating test quizzes...\n');
  for (const quiz of quizzes) {
    try {
      const createResult = await createQuiz(quiz);
      console.log(`${quiz.title} (${quiz.primary_colony})`);
      if (createResult.status === 201) {
        console.log(`  Created!`);
        const publishResult = await publishQuiz(quiz.slug);
        console.log(`  Published: ${publishResult.status === 200 ? 'Yes' : 'No'}`);
      } else {
        console.log(`  Failed: ${createResult.data}`);
      }
    } catch (error) {
      console.log(`  Error: ${error.message}`);
    }
  }
  console.log('\nDone!');
}

main();
