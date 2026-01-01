/**
 * Populate All 7 Quiz Types with Working Images
 * Quiz Types:
 * 1. Image Grid (4 image options) - Personality
 * 2. Text Input - Trivia
 * 3. Text List Options - Trivia
 * 4. Slider - Scored
 * 5. This/That Image - Personality
 * 6. This/That Trivia - Trivia
 * 7. ABCD Multiple Choice - Trivia
 */

const http = require('http');

const ADMIN_TOKEN = 'ayW1YVN3g72H';
const BASE_URL = 'http://localhost:5000';

// Reliable working images from Unsplash (direct URLs)
const IMAGES = {
  // Food images
  food: {
    pizza: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop',
    burger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop',
    sushi: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=400&fit=crop',
    pasta: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=400&fit=crop',
    salad: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop',
    tacos: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=400&fit=crop',
    iceCream: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68a?w=400&h=400&fit=crop',
    cake: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop',
  },
  // Travel/Nature
  travel: {
    beach: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=400&fit=crop',
    mountain: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=400&fit=crop',
    city: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop',
    forest: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&h=400&fit=crop',
    desert: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&h=400&fit=crop',
    lake: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&h=400&fit=crop',
  },
  // Pets
  pets: {
    cat: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop',
    dog: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop',
    bird: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400&h=400&fit=crop',
    fish: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=400&h=400&fit=crop',
    rabbit: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400&h=400&fit=crop',
    hamster: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400&h=400&fit=crop',
  },
  // Activities/Lifestyle
  activities: {
    reading: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=400&fit=crop',
    gaming: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=400&fit=crop',
    music: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop',
    sports: 'https://images.unsplash.com/photo-1461896836934- voices-11caedb5b26?w=400&h=400&fit=crop',
    cooking: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=400&fit=crop',
    art: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop',
  },
  // Seasons/Weather
  seasons: {
    summer: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=400&fit=crop',
    winter: 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=400&h=400&fit=crop',
    spring: 'https://images.unsplash.com/photo-1462275646964-a0e3571f4f69?w=400&h=400&fit=crop',
    autumn: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  },
  // Results images
  results: {
    excellent: 'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?w=600&h=400&fit=crop',
    good: 'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?w=600&h=400&fit=crop',
    average: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&h=400&fit=crop',
    poor: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop',
    // Personality results
    adventurer: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=600&h=400&fit=crop',
    homebody: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
    foodie: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop',
    creative: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&h=400&fit=crop',
    socialite: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop',
    introvert: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
  },
  // Hero/Thumbnail images
  heroes: {
    food: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=400&fit=crop',
    travel: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=400&fit=crop',
    personality: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=400&fit=crop',
    trivia: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&h=400&fit=crop',
    music: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop',
    movies: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=400&fit=crop',
    pets: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&h=400&fit=crop',
  },
};

// All 7 Quiz Types
const QUIZZES = [
  // 1. IMAGE GRID (4 Image Options) - Personality Quiz
  {
    title: 'Build Your Dream Vacation',
    slug: 'build-your-dream-vacation',
    description: 'Choose your perfect vacation elements and discover your travel personality!',
    type: 'personality',
    primary_colony: 'Travel',
    heroImage: IMAGES.heroes.travel,
    hero_image: IMAGES.heroes.travel,
    totalQuestions: 5,
    questions: [
      {
        id: 1,
        question: 'Pick your ideal destination',
        text: 'Pick your ideal destination',
        type: 'image-choice',
        image: '',
        options: [
          { id: 'opt1', text: 'Tropical Beach', label: 'Tropical Beach', image: IMAGES.travel.beach, personalityType: 'relaxer' },
          { id: 'opt2', text: 'Mountain Adventure', label: 'Mountain Adventure', image: IMAGES.travel.mountain, personalityType: 'adventurer' },
          { id: 'opt3', text: 'City Explorer', label: 'City Explorer', image: IMAGES.travel.city, personalityType: 'explorer' },
          { id: 'opt4', text: 'Forest Retreat', label: 'Forest Retreat', image: IMAGES.travel.forest, personalityType: 'naturelover' },
        ],
      },
      {
        id: 2,
        question: 'What activity sounds most fun?',
        text: 'What activity sounds most fun?',
        type: 'image-choice',
        image: '',
        options: [
          { id: 'opt1', text: 'Reading by the Pool', label: 'Reading by the Pool', image: IMAGES.activities.reading, personalityType: 'relaxer' },
          { id: 'opt2', text: 'Hiking & Sports', label: 'Hiking & Sports', image: IMAGES.travel.mountain, personalityType: 'adventurer' },
          { id: 'opt3', text: 'Museum & Art', label: 'Museum & Art', image: IMAGES.activities.art, personalityType: 'explorer' },
          { id: 'opt4', text: 'Nature Photography', label: 'Nature Photography', image: IMAGES.travel.lake, personalityType: 'naturelover' },
        ],
      },
      {
        id: 3,
        question: 'Choose your vacation meal',
        text: 'Choose your vacation meal',
        type: 'image-choice',
        image: '',
        options: [
          { id: 'opt1', text: 'Fresh Seafood', label: 'Fresh Seafood', image: IMAGES.food.sushi, personalityType: 'relaxer' },
          { id: 'opt2', text: 'Quick Energy Food', label: 'Quick Energy Food', image: IMAGES.food.burger, personalityType: 'adventurer' },
          { id: 'opt3', text: 'Local Street Food', label: 'Local Street Food', image: IMAGES.food.tacos, personalityType: 'explorer' },
          { id: 'opt4', text: 'Farm to Table', label: 'Farm to Table', image: IMAGES.food.salad, personalityType: 'naturelover' },
        ],
      },
      {
        id: 4,
        question: 'Pick your dream accommodation',
        text: 'Pick your dream accommodation',
        type: 'image-choice',
        image: '',
        options: [
          { id: 'opt1', text: 'Beach Resort', label: 'Beach Resort', image: IMAGES.travel.beach, personalityType: 'relaxer' },
          { id: 'opt2', text: 'Mountain Lodge', label: 'Mountain Lodge', image: IMAGES.travel.mountain, personalityType: 'adventurer' },
          { id: 'opt3', text: 'Boutique Hotel', label: 'Boutique Hotel', image: IMAGES.travel.city, personalityType: 'explorer' },
          { id: 'opt4', text: 'Cabin in Woods', label: 'Cabin in Woods', image: IMAGES.travel.forest, personalityType: 'naturelover' },
        ],
      },
      {
        id: 5,
        question: 'How do you want to travel?',
        text: 'How do you want to travel?',
        type: 'image-choice',
        image: '',
        options: [
          { id: 'opt1', text: 'Cruise Ship', label: 'Cruise Ship', image: IMAGES.travel.lake, personalityType: 'relaxer' },
          { id: 'opt2', text: 'Road Trip', label: 'Road Trip', image: IMAGES.travel.desert, personalityType: 'adventurer' },
          { id: 'opt3', text: 'Train Journey', label: 'Train Journey', image: IMAGES.travel.city, personalityType: 'explorer' },
          { id: 'opt4', text: 'Camping Van', label: 'Camping Van', image: IMAGES.travel.forest, personalityType: 'naturelover' },
        ],
      },
    ],
    results: [
      { id: 'r1', type: 'relaxer', title: 'The Beach Bum', description: 'You love to unwind! Your ideal vacation involves sun, sand, and zero stress. Beaches and resorts are your happy place.', image: IMAGES.results.homebody },
      { id: 'r2', type: 'adventurer', title: 'The Thrill Seeker', description: 'Adventure calls your name! You seek adrenaline, challenges, and pushing your limits on every trip.', image: IMAGES.results.adventurer },
      { id: 'r3', type: 'explorer', title: 'The Culture Vulture', description: 'You travel to learn! Museums, local food, history, and authentic experiences are your priorities.', image: IMAGES.results.creative },
      { id: 'r4', type: 'naturelover', title: 'The Nature Lover', description: 'You find peace in nature. Forests, wildlife, and eco-friendly travel speak to your soul.', image: IMAGES.results.introvert },
    ],
  },

  // 2. TEXT INPUT - Trivia Quiz
  {
    title: 'Guess the Famous Movie Quote',
    slug: 'guess-the-famous-movie-quote',
    description: 'Can you identify these iconic movie quotes? Type in the movie name!',
    type: 'trivia',
    primary_colony: 'Movies',
    heroImage: IMAGES.heroes.movies,
    hero_image: IMAGES.heroes.movies,
    totalQuestions: 5,
    questions: [
      {
        id: 1,
        question: '"Here\'s looking at you, kid." - Name the movie',
        text: '"Here\'s looking at you, kid." - Name the movie',
        type: 'text-input',
        image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&h=400&fit=crop',
        correctAnswer: 'Casablanca',
        options: [],
      },
      {
        id: 2,
        question: '"May the Force be with you." - Name the movie',
        text: '"May the Force be with you." - Name the movie',
        type: 'text-input',
        image: 'https://images.unsplash.com/photo-1472457897821-70d3819a0e24?w=600&h=400&fit=crop',
        correctAnswer: 'Star Wars',
        options: [],
      },
      {
        id: 3,
        question: '"I\'ll be back." - Name the movie',
        text: '"I\'ll be back." - Name the movie',
        type: 'text-input',
        image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=600&h=400&fit=crop',
        correctAnswer: 'The Terminator',
        options: [],
      },
      {
        id: 4,
        question: '"You can\'t handle the truth!" - Name the movie',
        text: '"You can\'t handle the truth!" - Name the movie',
        type: 'text-input',
        image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&h=400&fit=crop',
        correctAnswer: 'A Few Good Men',
        options: [],
      },
      {
        id: 5,
        question: '"Life is like a box of chocolates." - Name the movie',
        text: '"Life is like a box of chocolates." - Name the movie',
        type: 'text-input',
        image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&h=400&fit=crop',
        correctAnswer: 'Forrest Gump',
        options: [],
      },
    ],
    results: [
      { id: 'r1', type: 'excellent', title: 'Movie Master!', description: 'You really know your classic films! Hollywood should be calling you for trivia nights.', image: IMAGES.results.excellent },
      { id: 'r2', type: 'good', title: 'Film Buff', description: 'Great job! You have solid movie knowledge. Keep watching those classics!', image: IMAGES.results.good },
      { id: 'r3', type: 'average', title: 'Casual Viewer', description: 'Not bad! You know some classics but there\'s a whole world of cinema to explore.', image: IMAGES.results.average },
      { id: 'r4', type: 'poor', title: 'Time for Movie Night!', description: 'Looks like you need a movie marathon! Start with the classics and work your way up.', image: IMAGES.results.poor },
    ],
    point_ranges: [
      { min: 80, max: 100, result: 'r1' },
      { min: 60, max: 79, result: 'r2' },
      { min: 40, max: 59, result: 'r3' },
      { min: 0, max: 39, result: 'r4' },
    ],
  },

  // 3. TEXT LIST OPTIONS - Trivia Quiz
  {
    title: 'World Capitals Challenge',
    slug: 'world-capitals-challenge',
    description: 'Test your geography knowledge! Can you identify these world capitals?',
    type: 'trivia',
    primary_colony: 'General Knowledge',
    heroImage: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&h=400&fit=crop',
    hero_image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&h=400&fit=crop',
    totalQuestions: 6,
    questions: [
      {
        id: 1,
        question: 'What is the capital of Australia?',
        text: 'What is the capital of Australia?',
        type: 'single',
        image: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=600&h=400&fit=crop',
        options: [
          { id: 'a', text: 'Sydney', label: 'Sydney', correct: false },
          { id: 'b', text: 'Melbourne', label: 'Melbourne', correct: false },
          { id: 'c', text: 'Canberra', label: 'Canberra', correct: true },
          { id: 'd', text: 'Perth', label: 'Perth', correct: false },
        ],
      },
      {
        id: 2,
        question: 'What is the capital of Canada?',
        text: 'What is the capital of Canada?',
        type: 'single',
        image: 'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=600&h=400&fit=crop',
        options: [
          { id: 'a', text: 'Toronto', label: 'Toronto', correct: false },
          { id: 'b', text: 'Vancouver', label: 'Vancouver', correct: false },
          { id: 'c', text: 'Montreal', label: 'Montreal', correct: false },
          { id: 'd', text: 'Ottawa', label: 'Ottawa', correct: true },
        ],
      },
      {
        id: 3,
        question: 'What is the capital of Brazil?',
        text: 'What is the capital of Brazil?',
        type: 'single',
        image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600&h=400&fit=crop',
        options: [
          { id: 'a', text: 'Rio de Janeiro', label: 'Rio de Janeiro', correct: false },
          { id: 'b', text: 'São Paulo', label: 'São Paulo', correct: false },
          { id: 'c', text: 'Brasília', label: 'Brasília', correct: true },
          { id: 'd', text: 'Salvador', label: 'Salvador', correct: false },
        ],
      },
      {
        id: 4,
        question: 'What is the capital of South Africa?',
        text: 'What is the capital of South Africa?',
        type: 'single',
        image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600&h=400&fit=crop',
        options: [
          { id: 'a', text: 'Johannesburg', label: 'Johannesburg', correct: false },
          { id: 'b', text: 'Cape Town', label: 'Cape Town', correct: false },
          { id: 'c', text: 'Pretoria', label: 'Pretoria', correct: true },
          { id: 'd', text: 'Durban', label: 'Durban', correct: false },
        ],
      },
      {
        id: 5,
        question: 'What is the capital of Turkey?',
        text: 'What is the capital of Turkey?',
        type: 'single',
        image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=600&h=400&fit=crop',
        options: [
          { id: 'a', text: 'Istanbul', label: 'Istanbul', correct: false },
          { id: 'b', text: 'Ankara', label: 'Ankara', correct: true },
          { id: 'c', text: 'Izmir', label: 'Izmir', correct: false },
          { id: 'd', text: 'Antalya', label: 'Antalya', correct: false },
        ],
      },
      {
        id: 6,
        question: 'What is the capital of Switzerland?',
        text: 'What is the capital of Switzerland?',
        type: 'single',
        image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=600&h=400&fit=crop',
        options: [
          { id: 'a', text: 'Geneva', label: 'Geneva', correct: false },
          { id: 'b', text: 'Zurich', label: 'Zurich', correct: false },
          { id: 'c', text: 'Bern', label: 'Bern', correct: true },
          { id: 'd', text: 'Basel', label: 'Basel', correct: false },
        ],
      },
    ],
    results: [
      { id: 'r1', type: 'excellent', title: 'Geography Genius!', description: 'You really know your world capitals! Are you a geography teacher?', image: IMAGES.results.excellent },
      { id: 'r2', type: 'good', title: 'World Traveler', description: 'Great geography skills! You clearly pay attention to the world around you.', image: IMAGES.results.good },
      { id: 'r3', type: 'average', title: 'Explorer in Training', description: 'Not bad! A few more geography lessons and you\'ll be an expert.', image: IMAGES.results.average },
      { id: 'r4', type: 'poor', title: 'Time to Study Maps!', description: 'Geography isn\'t your strong suit yet, but that\'s okay! Start exploring the world map.', image: IMAGES.results.poor },
    ],
    point_ranges: [
      { min: 85, max: 100, result: 'r1' },
      { min: 65, max: 84, result: 'r2' },
      { min: 40, max: 64, result: 'r3' },
      { min: 0, max: 39, result: 'r4' },
    ],
  },

  // 4. SLIDER - Scored/Opinion Quiz
  {
    title: 'Rate Your Daily Habits',
    slug: 'rate-your-daily-habits',
    description: 'How do you rate your daily habits? Slide to answer and discover your lifestyle score!',
    type: 'scored',
    primary_colony: 'Lifestyle',
    heroImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=400&fit=crop',
    hero_image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=400&fit=crop',
    totalQuestions: 5,
    questions: [
      {
        id: 1,
        question: 'How many hours of sleep do you get on average?',
        text: 'How many hours of sleep do you get on average?',
        type: 'slider',
        image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=600&h=400&fit=crop',
        sliderMin: 4,
        sliderMax: 10,
        sliderMinLabel: '4 hours or less',
        sliderMaxLabel: '10+ hours',
        options: [],
      },
      {
        id: 2,
        question: 'How often do you exercise per week?',
        text: 'How often do you exercise per week?',
        type: 'slider',
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=400&fit=crop',
        sliderMin: 0,
        sliderMax: 7,
        sliderMinLabel: 'Never',
        sliderMaxLabel: 'Every day',
        options: [],
      },
      {
        id: 3,
        question: 'How many glasses of water do you drink daily?',
        text: 'How many glasses of water do you drink daily?',
        type: 'slider',
        image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600&h=400&fit=crop',
        sliderMin: 1,
        sliderMax: 10,
        sliderMinLabel: '1 glass',
        sliderMaxLabel: '10+ glasses',
        options: [],
      },
      {
        id: 4,
        question: 'How many servings of fruits/veggies do you eat daily?',
        text: 'How many servings of fruits/veggies do you eat daily?',
        type: 'slider',
        image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&h=400&fit=crop',
        sliderMin: 0,
        sliderMax: 8,
        sliderMinLabel: 'None',
        sliderMaxLabel: '8+ servings',
        options: [],
      },
      {
        id: 5,
        question: 'How would you rate your stress level?',
        text: 'How would you rate your stress level?',
        type: 'slider',
        image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=600&h=400&fit=crop',
        sliderMin: 1,
        sliderMax: 10,
        sliderMinLabel: 'Very calm',
        sliderMaxLabel: 'Extremely stressed',
        options: [],
      },
    ],
    results: [
      { id: 'r1', type: 'excellent', title: 'Health Champion!', description: 'Your daily habits are fantastic! Keep up the amazing work on your health journey.', image: IMAGES.results.excellent },
      { id: 'r2', type: 'good', title: 'On the Right Track', description: 'You\'re doing well! A few small tweaks could make your habits even better.', image: IMAGES.results.good },
      { id: 'r3', type: 'average', title: 'Room for Improvement', description: 'Your habits are okay, but there\'s definitely room to grow healthier!', image: IMAGES.results.average },
      { id: 'r4', type: 'poor', title: 'Time for a Change!', description: 'Your habits could use some work. Start small - maybe more water or better sleep?', image: IMAGES.results.poor },
    ],
    point_ranges: [
      { min: 80, max: 100, result: 'r1' },
      { min: 60, max: 79, result: 'r2' },
      { min: 40, max: 59, result: 'r3' },
      { min: 0, max: 39, result: 'r4' },
    ],
  },

  // 5. THIS/THAT IMAGE - Personality Quiz
  {
    title: 'Cat Person or Dog Person?',
    slug: 'cat-person-or-dog-person',
    description: 'Make your choices and find out if you\'re more of a cat person or a dog person!',
    type: 'personality',
    primary_colony: 'Personality',
    heroImage: IMAGES.heroes.pets,
    hero_image: IMAGES.heroes.pets,
    totalQuestions: 6,
    questions: [
      {
        id: 1,
        question: 'Which pet would you rather cuddle with?',
        text: 'Which pet would you rather cuddle with?',
        type: 'image-options',
        image: '',
        options: [
          { id: 'this', text: 'Fluffy Cat', label: 'Fluffy Cat', image: IMAGES.pets.cat, personalityType: 'cat' },
          { id: 'that', text: 'Golden Retriever', label: 'Golden Retriever', image: IMAGES.pets.dog, personalityType: 'dog' },
        ],
      },
      {
        id: 2,
        question: 'Which activity sounds better?',
        text: 'Which activity sounds better?',
        type: 'image-options',
        image: '',
        options: [
          { id: 'this', text: 'Quiet reading time', label: 'Quiet reading time', image: IMAGES.activities.reading, personalityType: 'cat' },
          { id: 'that', text: 'Outdoor adventure', label: 'Outdoor adventure', image: IMAGES.travel.mountain, personalityType: 'dog' },
        ],
      },
      {
        id: 3,
        question: 'Which describes you better?',
        text: 'Which describes you better?',
        type: 'image-options',
        image: '',
        options: [
          { id: 'this', text: 'Independent & mysterious', label: 'Independent & mysterious', image: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=400&h=400&fit=crop', personalityType: 'cat' },
          { id: 'that', text: 'Social & energetic', label: 'Social & energetic', image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400&h=400&fit=crop', personalityType: 'dog' },
        ],
      },
      {
        id: 4,
        question: 'Preferred evening?',
        text: 'Preferred evening?',
        type: 'image-options',
        image: '',
        options: [
          { id: 'this', text: 'Cozy night in', label: 'Cozy night in', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', personalityType: 'cat' },
          { id: 'that', text: 'Party with friends', label: 'Party with friends', image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=400&fit=crop', personalityType: 'dog' },
        ],
      },
      {
        id: 5,
        question: 'Which nap style?',
        text: 'Which nap style?',
        type: 'image-options',
        image: '',
        options: [
          { id: 'this', text: 'Anytime, anywhere naps', label: 'Anytime, anywhere naps', image: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=400&h=400&fit=crop', personalityType: 'cat' },
          { id: 'that', text: 'Too excited to nap', label: 'Too excited to nap', image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop', personalityType: 'dog' },
        ],
      },
      {
        id: 6,
        question: 'Meeting new people?',
        text: 'Meeting new people?',
        type: 'image-options',
        image: '',
        options: [
          { id: 'this', text: 'Cautious at first', label: 'Cautious at first', image: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=400&h=400&fit=crop', personalityType: 'cat' },
          { id: 'that', text: 'Instant best friends!', label: 'Instant best friends!', image: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=400&h=400&fit=crop', personalityType: 'dog' },
        ],
      },
    ],
    results: [
      { id: 'r1', type: 'cat', title: 'You\'re a Cat Person! 🐱', description: 'You value independence, quiet time, and meaningful connections. Like a cat, you\'re mysterious, graceful, and prefer quality over quantity in your relationships.', image: IMAGES.pets.cat },
      { id: 'r2', type: 'dog', title: 'You\'re a Dog Person! 🐕', description: 'You\'re loyal, energetic, and love making friends everywhere you go! Like a dog, you bring joy to everyone around you and never meet a stranger.', image: IMAGES.pets.dog },
    ],
  },

  // 6. THIS/THAT TRIVIA - Trivia Quiz with Two Options
  {
    title: 'Which Came First?',
    slug: 'which-came-first',
    description: 'Test your knowledge of history and inventions! Which one came first?',
    type: 'trivia',
    primary_colony: 'General Knowledge',
    heroImage: IMAGES.heroes.trivia,
    hero_image: IMAGES.heroes.trivia,
    totalQuestions: 6,
    questions: [
      {
        id: 1,
        question: 'Which was invented first?',
        text: 'Which was invented first?',
        type: 'image-options',
        image: '',
        options: [
          { id: 'this', text: 'Telephone', label: 'Telephone', image: 'https://images.unsplash.com/photo-1557180295-76eee20ae8aa?w=400&h=400&fit=crop', correct: true },
          { id: 'that', text: 'Light Bulb', label: 'Light Bulb', image: 'https://images.unsplash.com/photo-1532007449850-ecd4b90ff19d?w=400&h=400&fit=crop', correct: false },
        ],
      },
      {
        id: 2,
        question: 'Which movie was released first?',
        text: 'Which movie was released first?',
        type: 'image-options',
        image: '',
        options: [
          { id: 'this', text: 'Titanic (1997)', label: 'Titanic (1997)', image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=400&fit=crop', correct: false },
          { id: 'that', text: 'Jurassic Park (1993)', label: 'Jurassic Park (1993)', image: 'https://images.unsplash.com/photo-1606567595334-d39972c85dfd?w=400&h=400&fit=crop', correct: true },
        ],
      },
      {
        id: 3,
        question: 'Which company was founded first?',
        text: 'Which company was founded first?',
        type: 'image-options',
        image: '',
        options: [
          { id: 'this', text: 'Apple', label: 'Apple', image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&h=400&fit=crop', correct: true },
          { id: 'that', text: 'Microsoft', label: 'Microsoft', image: 'https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=400&h=400&fit=crop', correct: false },
        ],
      },
      {
        id: 4,
        question: 'Which social media came first?',
        text: 'Which social media came first?',
        type: 'image-options',
        image: '',
        options: [
          { id: 'this', text: 'Facebook', label: 'Facebook', image: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=400&h=400&fit=crop', correct: true },
          { id: 'that', text: 'Twitter', label: 'Twitter', image: 'https://images.unsplash.com/photo-1611605698323-b1e99cfd37ea?w=400&h=400&fit=crop', correct: false },
        ],
      },
      {
        id: 5,
        question: 'Which food was invented first?',
        text: 'Which food was invented first?',
        type: 'image-options',
        image: '',
        options: [
          { id: 'this', text: 'Pizza', label: 'Pizza', image: IMAGES.food.pizza, correct: true },
          { id: 'that', text: 'Hamburger', label: 'Hamburger', image: IMAGES.food.burger, correct: false },
        ],
      },
      {
        id: 6,
        question: 'Which came first?',
        text: 'Which came first?',
        type: 'image-options',
        image: '',
        options: [
          { id: 'this', text: 'World War I', label: 'World War I', image: 'https://images.unsplash.com/photo-1579762593175-20226054cad0?w=400&h=400&fit=crop', correct: true },
          { id: 'that', text: 'Titanic Sinking', label: 'Titanic Sinking', image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=400&fit=crop', correct: false },
        ],
      },
    ],
    results: [
      { id: 'r1', type: 'excellent', title: 'History Master!', description: 'You really know your dates! Your knowledge of history and inventions is impressive.', image: IMAGES.results.excellent },
      { id: 'r2', type: 'good', title: 'Well Informed!', description: 'Great job! You have a solid understanding of historical timelines.', image: IMAGES.results.good },
      { id: 'r3', type: 'average', title: 'Getting There!', description: 'Not bad! A few more history lessons and you\'ll be an expert.', image: IMAGES.results.average },
      { id: 'r4', type: 'poor', title: 'Time to Hit the Books!', description: 'History might not be your strong suit, but that\'s okay! There\'s so much to learn.', image: IMAGES.results.poor },
    ],
    point_ranges: [
      { min: 85, max: 100, result: 'r1' },
      { min: 65, max: 84, result: 'r2' },
      { min: 40, max: 64, result: 'r3' },
      { min: 0, max: 39, result: 'r4' },
    ],
  },

  // 7. ABCD MULTIPLE CHOICE - Classic Trivia
  {
    title: 'Music Legends Trivia',
    slug: 'music-legends-trivia',
    description: 'How well do you know music history? Test your knowledge of legendary artists!',
    type: 'trivia',
    primary_colony: 'Entertainment',
    heroImage: IMAGES.heroes.music,
    hero_image: IMAGES.heroes.music,
    totalQuestions: 6,
    questions: [
      {
        id: 1,
        question: 'Which artist is known as the "King of Pop"?',
        text: 'Which artist is known as the "King of Pop"?',
        type: 'single',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop',
        options: [
          { id: 'a', text: 'A) Elvis Presley', label: 'Elvis Presley', correct: false },
          { id: 'b', text: 'B) Michael Jackson', label: 'Michael Jackson', correct: true },
          { id: 'c', text: 'C) Prince', label: 'Prince', correct: false },
          { id: 'd', text: 'D) Stevie Wonder', label: 'Stevie Wonder', correct: false },
        ],
      },
      {
        id: 2,
        question: 'Which band released the album "Abbey Road"?',
        text: 'Which band released the album "Abbey Road"?',
        type: 'single',
        image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&h=400&fit=crop',
        options: [
          { id: 'a', text: 'A) The Rolling Stones', label: 'The Rolling Stones', correct: false },
          { id: 'b', text: 'B) Led Zeppelin', label: 'Led Zeppelin', correct: false },
          { id: 'c', text: 'C) The Beatles', label: 'The Beatles', correct: true },
          { id: 'd', text: 'D) Pink Floyd', label: 'Pink Floyd', correct: false },
        ],
      },
      {
        id: 3,
        question: 'What was Whitney Houston\'s biggest hit?',
        text: 'What was Whitney Houston\'s biggest hit?',
        type: 'single',
        image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&h=400&fit=crop',
        options: [
          { id: 'a', text: 'A) Greatest Love of All', label: 'Greatest Love of All', correct: false },
          { id: 'b', text: 'B) I Will Always Love You', label: 'I Will Always Love You', correct: true },
          { id: 'c', text: 'C) I Wanna Dance with Somebody', label: 'I Wanna Dance with Somebody', correct: false },
          { id: 'd', text: 'D) How Will I Know', label: 'How Will I Know', correct: false },
        ],
      },
      {
        id: 4,
        question: 'Which artist performed at the first Super Bowl halftime show in 1993?',
        text: 'Which artist performed at the first Super Bowl halftime show in 1993?',
        type: 'single',
        image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&h=400&fit=crop',
        options: [
          { id: 'a', text: 'A) Madonna', label: 'Madonna', correct: false },
          { id: 'b', text: 'B) Michael Jackson', label: 'Michael Jackson', correct: true },
          { id: 'c', text: 'C) Prince', label: 'Prince', correct: false },
          { id: 'd', text: 'D) Diana Ross', label: 'Diana Ross', correct: false },
        ],
      },
      {
        id: 5,
        question: 'Which song spent the most weeks at #1 on the Billboard Hot 100?',
        text: 'Which song spent the most weeks at #1 on the Billboard Hot 100?',
        type: 'single',
        image: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=600&h=400&fit=crop',
        options: [
          { id: 'a', text: 'A) Despacito', label: 'Despacito', correct: false },
          { id: 'b', text: 'B) Old Town Road', label: 'Old Town Road', correct: true },
          { id: 'c', text: 'C) Shape of You', label: 'Shape of You', correct: false },
          { id: 'd', text: 'D) Uptown Funk', label: 'Uptown Funk', correct: false },
        ],
      },
      {
        id: 6,
        question: 'Who was the lead singer of Queen?',
        text: 'Who was the lead singer of Queen?',
        type: 'single',
        image: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=600&h=400&fit=crop',
        options: [
          { id: 'a', text: 'A) Roger Taylor', label: 'Roger Taylor', correct: false },
          { id: 'b', text: 'B) Freddie Mercury', label: 'Freddie Mercury', correct: true },
          { id: 'c', text: 'C) Brian May', label: 'Brian May', correct: false },
          { id: 'd', text: 'D) John Deacon', label: 'John Deacon', correct: false },
        ],
      },
    ],
    results: [
      { id: 'r1', type: 'excellent', title: 'Music Encyclopedia!', description: 'You know your music legends inside and out! Are you secretly a music historian?', image: IMAGES.results.excellent },
      { id: 'r2', type: 'good', title: 'Melody Master', description: 'Great job! You clearly appreciate good music and know your legends.', image: IMAGES.results.good },
      { id: 'r3', type: 'average', title: 'Radio Listener', description: 'You know the hits, but there\'s a deeper world of music to explore!', image: IMAGES.results.average },
      { id: 'r4', type: 'poor', title: 'Time for a Music Marathon!', description: 'Grab some headphones and start discovering the legends of music!', image: IMAGES.results.poor },
    ],
    point_ranges: [
      { min: 85, max: 100, result: 'r1' },
      { min: 65, max: 84, result: 'r2' },
      { min: 40, max: 64, result: 'r3' },
      { min: 0, max: 39, result: 'r4' },
    ],
  },
];

// Helper function to make HTTP requests
function makeRequest(method, path, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ADMIN_TOKEN}`,
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function createOrUpdateQuiz(quiz) {
  try {
    // Try to update first
    const updateRes = await makeRequest('PUT', `/api/admin/quiz/${quiz.slug}`, quiz);
    if (updateRes.status === 200) {
      console.log(`✅ Updated: ${quiz.title}`);
      return true;
    }
    
    // If not found, create new
    if (updateRes.status === 404) {
      const createRes = await makeRequest('POST', '/api/admin/quiz', quiz);
      if (createRes.status === 201) {
        console.log(`✅ Created: ${quiz.title}`);
        return true;
      } else {
        console.log(`❌ Failed to create ${quiz.title}: ${JSON.stringify(createRes.data)}`);
        return false;
      }
    }
    
    console.log(`❌ Failed to update ${quiz.title}: ${JSON.stringify(updateRes.data)}`);
    return false;
  } catch (err) {
    console.log(`❌ Error with ${quiz.title}: ${err.message}`);
    return false;
  }
}

async function publishQuiz(slug) {
  try {
    const res = await makeRequest('PATCH', `/api/admin/quiz/${slug}/publish`, { publish: true });
    if (res.status === 200) {
      console.log(`   📢 Published: ${slug}`);
      return true;
    }
    return false;
  } catch (err) {
    return false;
  }
}

async function main() {
  console.log('🚀 Populating All 7 Quiz Types with Working Images\n');
  console.log('='.repeat(60));
  
  let created = 0;
  let failed = 0;

  for (const quiz of QUIZZES) {
    const success = await createOrUpdateQuiz(quiz);
    if (success) {
      created++;
      // Publish the quiz
      await publishQuiz(quiz.slug);
    } else {
      failed++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`\n✨ Complete! Created/Updated: ${created}, Failed: ${failed}`);
  console.log('\n📋 Quiz Types Created:');
  console.log('   1. Image Grid (4 Options) - "Build Your Dream Vacation"');
  console.log('   2. Text Input - "Guess the Famous Movie Quote"');
  console.log('   3. Text List Options - "World Capitals Challenge"');
  console.log('   4. Slider - "Rate Your Daily Habits"');
  console.log('   5. This/That Image - "Cat Person or Dog Person?"');
  console.log('   6. This/That Trivia - "Which Came First?"');
  console.log('   7. ABCD Multiple Choice - "Music Legends Trivia"');
}

main().catch(console.error);
