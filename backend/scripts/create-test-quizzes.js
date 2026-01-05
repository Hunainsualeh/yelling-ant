/**
 * Create test quizzes for all categories and question types
 * Run with: node scripts/create-test-quizzes.js
 */

const http = require('http');

const API_BASE = 'http://localhost:5000';
const AUTH_TOKEN = 'ayW1YVN3g72H';

const quizzes = [
  // 1. Personality Quiz
  {
    title: "Which Disney Princess Are You?",
    dek: "Discover your inner princess based on your personality traits!",
    slug: "disney-princess-personality",
    type: "personality",
    primary_colony: "Personality",
    tags: ["personality", "disney", "fun"],
    hero_image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800",
    questions: [
      {
        id: "q1",
        text: "How would your friends describe you?",
        type: "single",
        options: [
          { id: "a", text: "Brave and adventurous", map: { Merida: 3, Mulan: 2 } },
          { id: "b", text: "Kind and caring", map: { Cinderella: 3, Snow_White: 2 } },
          { id: "c", text: "Curious and independent", map: { Belle: 3, Ariel: 2 } },
          { id: "d", text: "Dreamy and romantic", map: { Aurora: 3, Rapunzel: 2 } }
        ]
      },
      {
        id: "q2",
        text: "Pick your ideal weekend activity:",
        type: "single",
        options: [
          { id: "a", text: "Exploring a new hiking trail", map: { Merida: 3, Pocahontas: 2 } },
          { id: "b", text: "Reading a good book", map: { Belle: 3, Cinderella: 1 } },
          { id: "c", text: "Swimming at the beach", map: { Ariel: 3, Moana: 2 } },
          { id: "d", text: "Trying a new restaurant", map: { Tiana: 3, Rapunzel: 1 } }
        ]
      }
    ],
    results: {
      Merida: { title: "Merida", description: "You're brave, independent, and wild at heart!" },
      Cinderella: { title: "Cinderella", description: "You're kind, patient, and always believe in dreams!" },
      Belle: { title: "Belle", description: "You're smart, curious, and see inner beauty in everyone!" },
      Aurora: { title: "Aurora", description: "You're dreamy, romantic, and graceful!" },
      Ariel: { title: "Ariel", description: "You're curious, adventurous, and follow your heart!" },
      Mulan: { title: "Mulan", description: "You're brave, loyal, and break all barriers!" }
    }
  },

  // 2. Love Quiz
  {
    title: "What's Your Love Language?",
    dek: "Find out how you express and receive love!",
    slug: "love-language-quiz",
    type: "personality",
    primary_colony: "Love",
    tags: ["love", "relationships", "personality"],
    hero_image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800",
    questions: [
      {
        id: "q1",
        text: "Your partner had a rough day. What do you do?",
        type: "single",
        options: [
          { id: "a", text: "Give them a long hug", map: { Physical_Touch: 3 } },
          { id: "b", text: "Tell them how much you appreciate them", map: { Words_of_Affirmation: 3 } },
          { id: "c", text: "Cook their favorite meal", map: { Acts_of_Service: 3 } },
          { id: "d", text: "Buy them a thoughtful gift", map: { Receiving_Gifts: 3 } },
          { id: "e", text: "Clear your schedule to spend time with them", map: { Quality_Time: 3 } }
        ]
      }
    ],
    results: {
      Physical_Touch: { title: "Physical Touch", description: "You show love through hugs, cuddles, and being close!" },
      Words_of_Affirmation: { title: "Words of Affirmation", description: "You express love through compliments and encouragement!" },
      Acts_of_Service: { title: "Acts of Service", description: "You show love by doing helpful things for others!" },
      Receiving_Gifts: { title: "Receiving Gifts", description: "You express love through thoughtful presents!" },
      Quality_Time: { title: "Quality Time", description: "You show love by giving undivided attention!" }
    }
  },

  // 3. Pop Celebrity Quiz
  {
    title: "Which Pop Star Are You?",
    dek: "Find your pop star twin based on your style and personality!",
    slug: "pop-star-quiz",
    type: "personality",
    primary_colony: "Pop Celebrity",
    tags: ["celebrity", "music", "fun"],
    hero_image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
    questions: [
      {
        id: "q1",
        text: "Your ideal concert outfit would be:",
        type: "single",
        options: [
          { id: "a", text: "Sparkly bodysuit with bold accessories", map: { Beyonce: 3, Lady_Gaga: 2 } },
          { id: "b", text: "Casual denim with a statement jacket", map: { Taylor_Swift: 3 } },
          { id: "c", text: "Oversized hoodie and sneakers", map: { Billie_Eilish: 3 } },
          { id: "d", text: "Elegant dress with heels", map: { Adele: 3, Ariana_Grande: 2 } }
        ]
      }
    ],
    results: {
      Beyonce: { title: "Beyoncé", description: "You're a powerhouse performer with unmatched star quality!" },
      Taylor_Swift: { title: "Taylor Swift", description: "You're relatable, creative, and tell amazing stories!" },
      Billie_Eilish: { title: "Billie Eilish", description: "You're unique, authentic, and don't follow trends!" },
      Adele: { title: "Adele", description: "You're soulful, emotional, and deeply talented!" }
    }
  },

  // 4. Movies Quiz (Trivia Type)
  {
    title: "Ultimate Movie Trivia Challenge",
    dek: "Test your knowledge of classic and modern cinema!",
    slug: "movie-trivia-quiz",
    type: "trivia",
    primary_colony: "Movies",
    tags: ["movies", "trivia", "entertainment"],
    hero_image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800",
    questions: [
      {
        id: "q1",
        text: "Which movie won the Academy Award for Best Picture in 2020?",
        type: "single",
        options: [
          { id: "a", text: "1917", correct: false },
          { id: "b", text: "Parasite", correct: true },
          { id: "c", text: "Joker", correct: false },
          { id: "d", text: "Once Upon a Time in Hollywood", correct: false }
        ]
      },
      {
        id: "q2",
        text: "Who directed 'Inception'?",
        type: "single",
        options: [
          { id: "a", text: "Steven Spielberg", correct: false },
          { id: "b", text: "Christopher Nolan", correct: true },
          { id: "c", text: "James Cameron", correct: false },
          { id: "d", text: "Martin Scorsese", correct: false }
        ]
      }
    ],
    results: {
      high: { title: "Movie Buff!", description: "You know your cinema! Impressive knowledge!" },
      medium: { title: "Casual Viewer", description: "Not bad! You know your popular movies!" },
      low: { title: "Time for a Movie Marathon!", description: "Time to watch some classics!" }
    }
  },

  // 5. Food Quiz
  {
    title: "What's Your Food Personality?",
    dek: "Discover what your food choices say about you!",
    slug: "food-personality-quiz",
    type: "personality",
    primary_colony: "Food",
    tags: ["food", "personality", "lifestyle"],
    hero_image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
    questions: [
      {
        id: "q1",
        text: "It's Friday night. What are you eating?",
        type: "single",
        options: [
          { id: "a", text: "Homemade pasta from scratch", map: { The_Chef: 3, The_Foodie: 1 } },
          { id: "b", text: "The trendiest new restaurant in town", map: { The_Foodie: 3, The_Explorer: 2 } },
          { id: "c", text: "Comfort food from your childhood", map: { The_Traditionalist: 3 } },
          { id: "d", text: "Something quick and healthy", map: { The_Health_Nut: 3 } }
        ]
      },
      {
        id: "q2",
        text: "Pick a cuisine to try for the first time:",
        type: "single",
        options: [
          { id: "a", text: "Ethiopian", map: { The_Explorer: 3 } },
          { id: "b", text: "French fine dining", map: { The_Foodie: 3 } },
          { id: "c", text: "Plant-based tasting menu", map: { The_Health_Nut: 3 } },
          { id: "d", text: "Grandma's secret recipes", map: { The_Traditionalist: 3 } }
        ]
      }
    ],
    results: {
      The_Chef: { title: "The Chef", description: "You love creating in the kitchen! Cooking is your art form." },
      The_Foodie: { title: "The Foodie", description: "You live for culinary experiences and discovering new flavors!" },
      The_Explorer: { title: "The Explorer", description: "You're adventurous and always seeking new cuisines!" },
      The_Traditionalist: { title: "The Traditionalist", description: "You appreciate classic recipes and comfort food!" },
      The_Health_Nut: { title: "The Health Nut", description: "You prioritize nutrition without sacrificing taste!" }
    }
  },

  // 6. Aesthetics Quiz
  {
    title: "What's Your Aesthetic?",
    dek: "Discover your visual style and vibe!",
    slug: "aesthetic-quiz",
    type: "personality",
    primary_colony: "Aesthetics",
    tags: ["aesthetics", "style", "personality"],
    hero_image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
    questions: [
      {
        id: "q1",
        text: "Pick your dream bedroom vibe:",
        type: "single",
        options: [
          { id: "a", text: "Minimalist with clean lines and neutral tones", map: { Minimalist: 3 } },
          { id: "b", text: "Cozy with fairy lights and lots of plants", map: { Cottagecore: 3 } },
          { id: "c", text: "Dark and moody with vintage pieces", map: { Dark_Academia: 3 } },
          { id: "d", text: "Bright and colorful with bold patterns", map: { Maximalist: 3 } }
        ]
      }
    ],
    results: {
      Minimalist: { title: "Minimalist", description: "Less is more! You love clean, simple, elegant spaces." },
      Cottagecore: { title: "Cottagecore", description: "You love cozy, nature-inspired, romantic vibes!" },
      Dark_Academia: { title: "Dark Academia", description: "You're drawn to vintage, scholarly, mysterious aesthetics!" },
      Maximalist: { title: "Maximalist", description: "More is more! You love bold, colorful, eclectic style!" }
    }
  },

  // 7. General Knowledge (Points-based)
  {
    title: "General Knowledge Challenge",
    dek: "How well do you know random facts?",
    slug: "general-knowledge-quiz",
    type: "points",
    primary_colony: "General Knowledge",
    tags: ["trivia", "knowledge", "facts"],
    hero_image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800",
    questions: [
      {
        id: "q1",
        text: "What is the capital of Australia?",
        type: "single",
        points: 10,
        options: [
          { id: "a", text: "Sydney", correct: false },
          { id: "b", text: "Melbourne", correct: false },
          { id: "c", text: "Canberra", correct: true },
          { id: "d", text: "Perth", correct: false }
        ]
      },
      {
        id: "q2",
        text: "Which planet is known as the Red Planet?",
        type: "single",
        points: 10,
        options: [
          { id: "a", text: "Venus", correct: false },
          { id: "b", text: "Mars", correct: true },
          { id: "c", text: "Jupiter", correct: false },
          { id: "d", text: "Saturn", correct: false }
        ]
      }
    ],
    results: {
      high: { title: "Genius!", description: "Your knowledge is impressive!", min_score: 80 },
      medium: { title: "Well Read!", description: "You know quite a lot!", min_score: 50 },
      low: { title: "Keep Learning!", description: "There's always more to discover!", min_score: 0 }
    }
  },

  // 8. Entertainment Quiz
  {
    title: "TV Shows Personality Match",
    dek: "Find out which TV show matches your personality!",
    slug: "tv-show-personality-quiz",
    type: "personality",
    primary_colony: "Entertainment",
    tags: ["tv", "entertainment", "personality"],
    hero_image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800",
    questions: [
      {
        id: "q1",
        text: "How do you spend a rainy Sunday?",
        type: "single",
        options: [
          { id: "a", text: "Binge-watching with snacks", map: { The_Office: 3 } },
          { id: "b", text: "Solving puzzles or mysteries", map: { Sherlock: 3 } },
          { id: "c", text: "Reading fantasy novels", map: { Game_of_Thrones: 3 } },
          { id: "d", text: "Catching up on news and documentaries", map: { Breaking_Bad: 3 } }
        ]
      }
    ],
    results: {
      The_Office: { title: "The Office", description: "You love humor, relatable moments, and workplace comedy!" },
      Sherlock: { title: "Sherlock", description: "You're analytical, clever, and love a good mystery!" },
      Game_of_Thrones: { title: "Game of Thrones", description: "You love epic stories, complex characters, and drama!" },
      Breaking_Bad: { title: "Breaking Bad", description: "You appreciate intense storytelling and character development!" }
    }
  },

  // 9. Lifestyle Quiz
  {
    title: "What's Your Self-Care Style?",
    dek: "Discover how you recharge and take care of yourself!",
    slug: "self-care-style-quiz",
    type: "personality",
    primary_colony: "Lifestyle",
    tags: ["lifestyle", "wellness", "self-care"],
    hero_image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
    questions: [
      {
        id: "q1",
        text: "After a stressful week, you prefer to:",
        type: "single",
        options: [
          { id: "a", text: "Go for a long run or workout", map: { Active_Recharger: 3 } },
          { id: "b", text: "Have a spa day at home", map: { Pamper_Pro: 3 } },
          { id: "c", text: "Spend time with close friends", map: { Social_Butterfly: 3 } },
          { id: "d", text: "Stay in with a good book or movie", map: { Cozy_Homebody: 3 } }
        ]
      }
    ],
    results: {
      Active_Recharger: { title: "Active Recharger", description: "You recharge through movement and physical activity!" },
      Pamper_Pro: { title: "Pamper Pro", description: "You love treating yourself with relaxation and spa vibes!" },
      Social_Butterfly: { title: "Social Butterfly", description: "You recharge through connection and quality time!" },
      Cozy_Homebody: { title: "Cozy Homebody", description: "You find peace in solitude and cozy activities!" }
    }
  },

  // 10. Science Quiz (Multiple Choice with Images)
  {
    title: "Space Exploration Trivia",
    dek: "Test your knowledge of the cosmos!",
    slug: "space-trivia-quiz",
    type: "trivia",
    primary_colony: "Science",
    tags: ["science", "space", "trivia"],
    hero_image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800",
    questions: [
      {
        id: "q1",
        text: "Which spacecraft made the first successful Mars landing?",
        type: "single",
        options: [
          { id: "a", text: "Viking 1", correct: true },
          { id: "b", text: "Spirit", correct: false },
          { id: "c", text: "Curiosity", correct: false },
          { id: "d", text: "Perseverance", correct: false }
        ]
      },
      {
        id: "q2",
        text: "What is the largest moon in our solar system?",
        type: "single",
        options: [
          { id: "a", text: "Europa", correct: false },
          { id: "b", text: "Titan", correct: false },
          { id: "c", text: "Ganymede", correct: true },
          { id: "d", text: "Callisto", correct: false }
        ]
      }
    ],
    results: {
      high: { title: "Space Expert!", description: "NASA should hire you!" },
      medium: { title: "Amateur Astronomer", description: "You know your way around the cosmos!" },
      low: { title: "Earth Dweller", description: "Time to look up at the stars more!" }
    }
  },

  // 11. Sports Quiz
  {
    title: "Ultimate Sports Trivia",
    dek: "Test your sports knowledge across all leagues!",
    slug: "sports-trivia-quiz",
    type: "trivia",
    primary_colony: "Sports",
    tags: ["sports", "trivia", "athletics"],
    hero_image: "https://images.unsplash.com/photo-1461896836934- voices-of-hope?w=800",
    questions: [
      {
        id: "q1",
        text: "Which country has won the most FIFA World Cups?",
        type: "single",
        options: [
          { id: "a", text: "Germany", correct: false },
          { id: "b", text: "Brazil", correct: true },
          { id: "c", text: "Argentina", correct: false },
          { id: "d", text: "Italy", correct: false }
        ]
      },
      {
        id: "q2",
        text: "How many NBA championships did Michael Jordan win?",
        type: "single",
        options: [
          { id: "a", text: "4", correct: false },
          { id: "b", text: "5", correct: false },
          { id: "c", text: "6", correct: true },
          { id: "d", text: "7", correct: false }
        ]
      }
    ],
    results: {
      high: { title: "Sports Fanatic!", description: "You're a true sports encyclopedia!" },
      medium: { title: "Casual Fan", description: "You know your popular sports facts!" },
      low: { title: "Bench Warmer", description: "Time to catch some games!" }
    }
  }
];

async function createQuiz(quiz) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(quiz);
    
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/admin/quiz',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(body);
          resolve({ status: res.statusCode, data: result, title: quiz.title });
        } catch (e) {
          resolve({ status: res.statusCode, data: body, title: quiz.title });
        }
      });
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
      hostname: 'localhost',
      port: 5000,
      path: `/api/admin/quiz/${slug}/publish`,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('🎯 Creating test quizzes for all categories...\n');
  
  for (const quiz of quizzes) {
    try {
      // Create the quiz
      const createResult = await createQuiz(quiz);
      console.log(`📝 ${quiz.title}`);
      console.log(`   Category: ${quiz.primary_colony}`);
      console.log(`   Type: ${quiz.type}`);
      
      if (createResult.status === 201) {
        console.log(`   ✅ Created successfully!`);
        
        // Publish the quiz
        const publishResult = await publishQuiz(quiz.slug);
        if (publishResult.status === 200) {
          console.log(`   ✅ Published!`);
        } else {
          console.log(`   ⚠️ Publish failed: ${JSON.stringify(publishResult.data)}`);
        }
      } else {
        console.log(`   ❌ Create failed: ${JSON.stringify(createResult.data)}`);
      }
      console.log('');
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}\n`);
    }
  }
  
  console.log('\n✨ Done! Check the admin panel and frontend to see the quizzes.');
}

main();
