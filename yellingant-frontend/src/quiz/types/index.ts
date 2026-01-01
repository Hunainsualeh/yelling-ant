export interface QuizQuestion {
  id: number;
  question: string;
  text?: string; // Alternative field name from admin panel
  image?: string;
  options?: QuizAnswer[];
  type:
    | 'single'
    | 'multiple'
    | 'personality'
    | 'image-choice'
    | 'text-input'
    | 'slider'
    | 'image-options'
    | 'figma-image'
    | 'this-that'
    | 'abcd';
  correctAnswer?: string | string[]; // For trivia quizzes
  feedback?: {
    correct?: string;
    incorrect?: string;
  };
  // For slider type
  sliderMin?: number;
  sliderMax?: number;
  sliderMinLabel?: string;
  sliderMaxLabel?: string;
}

export interface QuizAnswer {
  id: string;
  text: string;
  image?: string;
  label?: string; // For image choices (e.g., "This", "That", "Cat", "Dog")
  personalityType?: string;
  score?: number;
  correct?: boolean; // For trivia questions
}

export interface QuizResult {
  id: string;
  type: string;
  title: string;
  description: string;
  image: string;
  shareText?: string;
  // Score range for trivia results
  minScore?: number;
  maxScore?: number;
}

// Answer summary for trivia quizzes
export interface AnswerSummary {
  questionIndex: number;
  questionText: string;
  selectedAnswer: string;
  correctAnswer?: string;
  isCorrect?: boolean;
  questionImage?: string;
}

export interface QuizData {
  id: number;
  slug: string;
  title: string;
  description: string;
  dek?: string; // Alternative field name from backend
  heroImage: string;
  hero_image?: string; // Alternative field name from backend
  totalQuestions: number;
  questions: QuizQuestion[];
  results: QuizResult[];
  type: 'personality' | 'trivia' | 'scored' | 'image-options' | 'figma-image' | 'points' | 'this-that';
  primary_colony?: string;
  // Whether to show correct/wrong feedback during quiz
  showFeedback?: boolean;
}

export interface QuizState {
  currentQuestionIndex: number;
  answers: Record<number, string | string[]>;
  score: number;
  result: QuizResult | null;
  isCompleted: boolean;
  showFeedback: boolean;
  isCorrect: boolean | null;
  // Store answer summaries for trivia review
  answerSummaries?: AnswerSummary[];
}
