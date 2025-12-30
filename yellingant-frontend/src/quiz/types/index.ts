export interface QuizQuestion {
  id: number;
  question: string;
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
    | 'figma-image';
  correctAnswer?: string | string[]; // For trivia quizzes
  feedback?: {
    correct?: string;
    incorrect?: string;
  };
  // For image-options type
  text?: string;
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
}

export interface QuizData {
  id: number;
  slug: string;
  title: string;
  description: string;
  heroImage: string;
  totalQuestions: number;
  questions: QuizQuestion[];
  results: QuizResult[];
  type: 'personality' | 'trivia' | 'scored' | 'image-options' | 'figma-image';
}

export interface QuizState {
  currentQuestionIndex: number;
  answers: Record<number, string | string[]>;
  score: number;
  result: QuizResult | null;
  isCompleted: boolean;
  showFeedback: boolean;
  isCorrect: boolean | null;
}
