export const COLORS = {
  primary: '#9333EA', // purple-600
  secondary: '#FFD700', // yellow
  accent: '#EF4444', // red-500
  dark: '#111827', // gray-900
  light: '#F9FAFB', // gray-50
} as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export const NAV_ITEMS = [
  'Real Small Story™',
  'Beauty & Health',
  'HBCU',
  'Relationships',
  'Entertainment',
  'Family',
] as const;

export const QUIZ_CATEGORIES = [
  { id: 1, name: 'Personality', icon: '👤', color: 'bg-purple-600' },
  { id: 2, name: 'Love', icon: '❤️', color: 'bg-pink-500' },
  { id: 3, name: 'Pop Celebrity', icon: '🎬', color: 'bg-blue-500' },
  { id: 4, name: 'Movies', icon: '🎥', color: 'bg-yellow-500' },
  { id: 5, name: 'Food', icon: '🍔', color: 'bg-green-500' },
  { id: 6, name: 'Aesthetics', icon: '✨', color: 'bg-pink-400' },
  { id: 7, name: 'Mindfulness', icon: '💭', color: 'bg-orange-500' },
  { id: 8, name: 'Culture & History', icon: '📚', color: 'bg-cyan-500' },
] as const;
