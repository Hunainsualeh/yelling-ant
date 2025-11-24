/**
 * QuizBuzz Comprehensive JSON Schema
 * 
 * This schema defines the complete structure for BuzzFeed-style quizzes
 * Supports: Personality, Points, Trivia, and Branching quiz types
 * 
 * Version: 1.0.0
 * Last Updated: November 2025
 */

export interface QuizSchema {
  // ================================
  // 1. QUIZ BASICS
  // ================================
  title: string;                    // Quiz headline
  dek?: string;                     // Subheadline/description
  slug: string;                     // URL-friendly identifier (kebab-case)
  type: 'personality' | 'points' | 'trivia' | 'branching';
  
  // Colony Integration (Yelling Ant)
  primary_colony: string;           // Required
  secondary_colonies?: string[];    // Max 2
  tags?: string[];                  // For discovery and recommendations
  
  // Assets
  hero_image: string;               // Main quiz image (1200x675px recommended)
  images_base?: string;             // CDN base URL for relative paths
  
  // ================================
  // 2. THEME & COLORS
  // ================================
  theme?: {
    bg_color?: string;              // Background color (hex)
    primary_color?: string;         // Buttons, progress bar (hex)
    text_color?: string;            // Text override (hex)
    font_family?: string;           // From approved list
    button_style?: 'rounded' | 'pill' | 'square';
    progress_style?: 'thin' | 'thick';
  };
  
  // ================================
  // 3. QUESTIONS
  // ================================
  questions: QuizQuestion[];        // 5-8 questions recommended
  shuffle_all?: boolean;            // Shuffle question order
  
  // ================================
  // 4. RESULTS / OUTCOMES
  // ================================
  results: {
    [key: string]: QuizResult;      // 4-8 outcomes
  };
  
  // Points mode specific
  point_ranges?: {
    min: number;
    max: number;
    result: string;                 // Maps to results key
  }[];
  
  // ================================
  // 5. SEO & SOCIAL
  // ================================
  seo?: {
    title?: string;                 // OG title override
    description?: string;           // OG description
    og_image?: string;              // OG image override
    noindex?: boolean;              // Prevent indexing
    utm_template?: string;          // Share link UTM pattern
  };
  
  // ================================
  // 6. SPONSORSHIP
  // ================================
  sponsored?: {
    enabled: boolean;
    name?: string;                  // Sponsor name
    logo?: string;                  // Sponsor logo URL
    disclosure?: string;            // Legal disclosure text
    cta_label?: string;             // Call-to-action text
    cta_url?: string;               // Call-to-action link
  };
  
  // ================================
  // 7. AD CONFIGURATION
  // ================================
  ad_config?: {
    enabled_slots: string[];        // Ad slot IDs from master spec
    scroll_trigger_slots?: {
      slot: string;                 // YA_QUIZ_*_SCROLL_###
      trigger_percent: number;      // 25, 50, 75
    }[];
  };
  
  // ================================
  // 8. ADVANCED & ANALYTICS
  // ================================
  require_login_for_badge?: boolean;
  ab?: {
    headline_variants?: string[];   // A/B test headlines
    q1_variants?: string[];         // A/B test first question
  };
  
  // ================================
  // 9. METADATA
  // ================================
  status?: 'draft' | 'scheduled' | 'published' | 'archived';
  publish_at?: string;              // ISO 8601 datetime
  version?: number;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

/**
 * Question Structure
 */
export interface QuizQuestion {
  id: string;                       // Unique question ID
  text: string;                     // Question text
  image?: string;                   // Optional question image/GIF
  type?: 'single' | 'multi-select' | 'trivia' | 'branching';
  shuffle?: boolean;                // Shuffle answer options
  
  // Multi-select specific
  min_select?: number;              // Minimum selections required
  max_select?: number;              // Maximum selections allowed
  
  // Options/Answers
  options: QuizOption[];
}

/**
 * Answer Option Structure
 */
export interface QuizOption {
  id: string;                       // Unique option ID
  text: string;                     // Answer text
  image?: string;                   // Optional image/GIF for option
  
  // Personality mode: weighted outcome mapping
  map?: {
    [outcomeKey: string]: number;   // Outcome weight (e.g., "Visionary": 2)
  };
  
  // Points mode: numeric score
  points?: number;
  
  // Trivia mode: correctness
  correct?: boolean;
  
  // Branching mode: next question
  next?: string;                    // Question ID to jump to
}

/**
 * Result/Outcome Structure
 */
export interface QuizResult {
  title: string;                    // Result name
  description: string;              // Result explanation
  image: string;                    // Result image (1200x1200 or 1200x675)
  theme_color?: string;             // Optional color override (hex)
  badge?: string;                   // Badge ID to award
  
  // Colony prompts for sharing
  colony_prompts?: string[];        // Pre-filled post suggestions
  
  // Why you got this
  explanation?: string;             // One-liner about the outcome
}

/**
 * Quiz Submission (from user)
 */
export interface QuizSubmission {
  quiz_slug: string;
  answers: {
    question_id: string;
    option_ids: string[];           // Array to support multi-select
  }[];
  user_id?: string;                 // Optional if logged in
  session_id?: string;              // For anonymous tracking
}

/**
 * Quiz Result Response (to user)
 */
export interface QuizResultResponse {
  outcome_key: string;
  outcome: QuizResult;
  score?: number;                   // For points/trivia mode
  total_possible?: number;          // For trivia mode
  badge_awarded?: boolean;
  share_url: string;
  share_image: string;
}

/**
 * Analytics Event
 */
export interface QuizAnalyticsEvent {
  quiz_slug: string;
  event_type: 
    | 'quiz_view' 
    | 'quiz_start' 
    | 'quiz_question_answered'
    | 'quiz_completed'
    | 'quiz_retaken'
    | 'quiz_share_click'
    | 'quiz_result_impression'
    | 'quiz_result_badge_awarded'
    | 'quiz_related_quiz_click';
  event_data?: Record<string, any>;
  user_id?: string;
  session_id?: string;
  timestamp: string;
}
