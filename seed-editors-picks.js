// Script to create sample quizzes with Editor's Pick enabled
// Run with: node seed-editors-picks.js

const fetch = require('node-fetch');

const API_BASE = 'https://quiz-backend.brewly.ae';
const ADMIN_TOKEN = 'ayW1YVN3g72H';

const sampleQuizzes = [
  {
    title: "Which Friends Character Are You?",
    slug: "which-friends-character-are-you",
    description: "Find out which iconic Friends character matches your personality!",
    type: "personality",
    primary_colony: "Pop Celebrity",
    heroImage: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=500&fit=crop",
    metadata: {
      featured: true,
      editorsPick: true,
      difficulty: "Easy",
      category: "Pop Celebrity"
    },
    questions: [
      {
        id: 1,
        question: "How do you spend your weekends?",
        text: "How do you spend your weekends?",
        type: "single",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
        options: [
          { id: "opt1", text: "Chilling at the coffee shop", label: "Chilling at the coffee shop", points: 0, correct: false },
          { id: "opt2", text: "Cooking something fancy", label: "Cooking something fancy", points: 0, correct: false },
          { id: "opt3", text: "Working on my career", label: "Working on my career", points: 0, correct: false },
          { id: "opt4", text: "Watching sports", label: "Watching sports", points: 0, correct: false }
        ]
      }
    ],
    results: [
      { id: "r1", type: "rachel", title: "You're Rachel!", description: "Fashion-forward and ambitious!", image: "", minScore: 0, maxScore: 100 }
    ]
  },
  {
    title: "What Type of Pizza Are You?",
    slug: "what-type-of-pizza-are-you",
    description: "Discover your pizza personality based on your food preferences!",
    type: "personality",
    primary_colony: "Food",
    heroImage: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=500&fit=crop",
    metadata: {
      featured: true,
      editorsPick: true,
      difficulty: "Easy",
      category: "Food"
    },
    questions: [
      {
        id: 1,
        question: "What's your ideal Friday night?",
        text: "What's your ideal Friday night?",
        type: "single",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop",
        options: [
          { id: "opt1", text: "Netflix and chill", label: "Netflix and chill", points: 0, correct: false },
          { id: "opt2", text: "Party with friends", label: "Party with friends", points: 0, correct: false },
          { id: "opt3", text: "Fine dining experience", label: "Fine dining experience", points: 0, correct: false },
          { id: "opt4", text: "Adventure outdoors", label: "Adventure outdoors", points: 0, correct: false }
        ]
      }
    ],
    results: [
      { id: "r1", type: "margherita", title: "You're a Margherita!", description: "Classic, timeless, and loved by everyone!", image: "", minScore: 0, maxScore: 100 }
    ]
  },
  {
    title: "Can You Guess the 90s Song?",
    slug: "can-you-guess-the-90s-song",
    description: "Test your knowledge of iconic 90s music hits!",
    type: "trivia",
    primary_colony: "Entertainment",
    heroImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=500&fit=crop",
    metadata: {
      featured: true,
      editorsPick: true,
      difficulty: "Medium",
      category: "Entertainment"
    },
    questions: [
      {
        id: 1,
        question: "Which artist sang 'Baby One More Time'?",
        text: "Which artist sang 'Baby One More Time'?",
        type: "single",
        image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600&h=400&fit=crop",
        options: [
          { id: "opt1", text: "Britney Spears", label: "Britney Spears", points: 10, correct: true },
          { id: "opt2", text: "Christina Aguilera", label: "Christina Aguilera", points: 0, correct: false },
          { id: "opt3", text: "Madonna", label: "Madonna", points: 0, correct: false },
          { id: "opt4", text: "Mariah Carey", label: "Mariah Carey", points: 0, correct: false }
        ],
        correctAnswer: "Britney Spears"
      }
    ],
    results: [
      { id: "r1", type: "expert", title: "90s Music Expert!", description: "You really know your 90s hits!", image: "", minScore: 80, maxScore: 100 },
      { id: "r2", type: "novice", title: "Keep Trying!", description: "Time to listen to more 90s music!", image: "", minScore: 0, maxScore: 79 }
    ]
  },
  {
    title: "Which City Should You Live In?",
    slug: "which-city-should-you-live-in",
    description: "Find your ideal city based on your lifestyle preferences!",
    type: "personality",
    primary_colony: "Lifestyle",
    heroImage: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&h=500&fit=crop",
    metadata: {
      featured: true,
      editorsPick: true,
      difficulty: "Easy",
      category: "Lifestyle"
    },
    questions: [
      {
        id: 1,
        question: "What's your ideal weather?",
        text: "What's your ideal weather?",
        type: "single",
        image: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600&h=400&fit=crop",
        options: [
          { id: "opt1", text: "Sunny and warm all year", label: "Sunny and warm all year", points: 0, correct: false },
          { id: "opt2", text: "Four distinct seasons", label: "Four distinct seasons", points: 0, correct: false },
          { id: "opt3", text: "Cool and rainy", label: "Cool and rainy", points: 0, correct: false },
          { id: "opt4", text: "Tropical and humid", label: "Tropical and humid", points: 0, correct: false }
        ]
      }
    ],
    results: [
      { id: "r1", type: "paris", title: "Paris!", description: "Romance, culture, and croissants await you!", image: "", minScore: 0, maxScore: 100 }
    ]
  }
];

async function createQuiz(quizData) {
  try {
    const response = await fetch(`${API_BASE}/api/admin/quiz`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ADMIN_TOKEN}`
      },
      body: JSON.stringify(quizData)
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      console.log(`❌ Failed to create "${quizData.title}":`, result.error);
      return null;
    }
    
    console.log(`✅ Created: "${quizData.title}" (slug: ${result.quiz?.slug})`);
    
    // Now publish the quiz
    const publishRes = await fetch(`${API_BASE}/api/admin/quiz/${result.quiz?.slug}/publish`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ADMIN_TOKEN}`
      },
      body: JSON.stringify({ publish: true })
    });
    
    if (publishRes.ok) {
      console.log(`   📢 Published!`);
    }
    
    return result;
  } catch (err) {
    console.error(`❌ Error creating "${quizData.title}":`, err.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Creating sample quizzes with Editor\'s Pick...\n');
  
  for (const quiz of sampleQuizzes) {
    await createQuiz(quiz);
  }
  
  console.log('\n✨ Done! Check the Editor\'s Picks section on your homepage.');
}

main();
