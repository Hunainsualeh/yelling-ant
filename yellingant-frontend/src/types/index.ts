export interface Quiz {
  id: number;
  slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  heroImage?: string;
  views: number;
  plays: number;
  badge?: 'HOT' | 'NEW' | 'POPULAR' | 'TRENDING';
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface QuizQuestion {
  id: string;
  text: string;
  image?: string;
  options: QuizOption[];
  type: 'single' | 'multiple' | 'trivia';
}

export interface QuizOption {
  id: string;
  text: string;
  image?: string;
  points?: number;
  correct?: boolean;
  map?: Record<string, number>;
}

export interface QuizResult {
  id: string;
  title: string;
  description: string;
  image: string;
  themeColor?: string;
  badge?: string;
}

export interface AdSlotConfig {
  id: string;
  position: 'top' | 'middle' | 'bottom' | 'inline' | 'sidebar';
  device: 'desktop' | 'mobile' | 'both';
  size?: string;
}
