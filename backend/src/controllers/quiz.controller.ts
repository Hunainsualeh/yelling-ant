import { Request, Response, NextFunction } from 'express';
import { query } from '../config/database';

/**
 * GET /api/quiz
 * List all published quizzes
 */
export const getQuizList = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { colony, tag, category, limit = '20', offset = '0' } = req.query;

    let queryText = `
      SELECT id, slug, title, quiz_data->>'dek' as dek, 
             quiz_data->>'hero_image' as hero_image,
             quiz_data->>'heroImage' as cover_image,
             quiz_data->>'primary_colony' as primary_colony,
             quiz_data->'tags' as tags,
             quiz_data->'metadata' as metadata,
             quiz_data as quiz_data,
             created_at, updated_at
      FROM quizzes
      WHERE status = 'published'
    `;

    const params: any[] = [];

    // Filter by colony
    if (colony) {
      queryText += ` AND (
        quiz_data->>'primary_colony' = $${params.length + 1}
        OR quiz_data->'secondary_colonies' ? $${params.length + 1}
      )`;
      params.push(colony);
    }

    // Filter by category (primary_colony)
    if (category) {
      queryText += ` AND quiz_data->>'primary_colony' = $${params.length + 1}`;
      params.push(category);
    }

    // Filter by tag
    if (tag) {
      queryText += ` AND quiz_data->'tags' ? $${params.length + 1}`;
      params.push(tag);
    }

    queryText += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await query(queryText, params);

    res.json({
      quizzes: result.rows,
      total: result.rows.length,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/quiz/search
 * Search quizzes with normalized matching (title, description, category, tags)
 */
export const searchQuizzes = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { q, limit = '20', offset = '0' } = req.query;

    if (!q || typeof q !== 'string' || q.trim().length === 0) {
      res.json({ quizzes: [], total: 0, query: '' });
      return;
    }

    // Normalize search query: trim, lowercase
    const searchTerm = q.trim().toLowerCase();
    // Create pattern for ILIKE (partial match anywhere in string)
    const pattern = `%${searchTerm}%`;

    // Search in title, description (dek), category, and convert to searchable form
    const queryText = `
      SELECT id, slug, title, 
             quiz_data->>'dek' as dek,
             quiz_data->>'description' as description, 
             quiz_data->>'hero_image' as hero_image,
             quiz_data->>'heroImage' as cover_image,
             quiz_data->>'primary_colony' as primary_colony,
             quiz_data->'tags' as tags,
             quiz_data->'metadata' as metadata,
             created_at, updated_at
      FROM quizzes
      WHERE status = 'published'
        AND (
          LOWER(title) LIKE $1
          OR LOWER(quiz_data->>'dek') LIKE $1
          OR LOWER(quiz_data->>'description') LIKE $1
          OR LOWER(quiz_data->>'primary_colony') LIKE $1
          OR LOWER(slug) LIKE $1
          OR EXISTS (
            SELECT 1 FROM jsonb_array_elements_text(quiz_data->'tags') tag 
            WHERE LOWER(tag) LIKE $1
          )
        )
      ORDER BY 
        CASE 
          WHEN LOWER(title) LIKE $1 THEN 1
          WHEN LOWER(quiz_data->>'primary_colony') LIKE $1 THEN 2
          ELSE 3
        END,
        created_at DESC
      LIMIT $2 OFFSET $3
    `;

    const result = await query(queryText, [pattern, limit, offset]);

    res.json({
      quizzes: result.rows,
      total: result.rows.length,
      query: searchTerm,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    });
  } catch (error) {
    console.error('Search error:', error);
    next(error);
  }
};

/**
 * GET /api/quiz/:slug
 * Fetch a single quiz by slug
 */
export const getQuizBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slug } = req.params;
    const { shuffle = 'false' } = req.query;

    const result = await query(
      'SELECT quiz_data FROM quizzes WHERE slug = $1 AND status = $2',
      [slug, 'published']
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        error: 'Quiz not found',
        slug,
      });
      return;
    }

    let quizData = result.rows[0].quiz_data;

    // Server-side shuffle of options when question.shuffle_options === true or query param shuffle=true
    if (shuffle === 'true') {
      quizData = JSON.parse(JSON.stringify(quizData));
      if (Array.isArray(quizData.questions)) {
        for (const q of quizData.questions) {
          if (q.shuffle_options) {
            // Fisher-Yates shuffle
            for (let i = q.options.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [q.options[i], q.options[j]] = [q.options[j], q.options[i]];
            }
          }
        }
      }
    }

    // Track view event (analytics)
    await trackAnalytics(slug, 'quiz_view', {
      timestamp: new Date().toISOString(),
    });

    res.json(quizData);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/quiz/:slug/submit
 * Submit quiz answers and calculate result
 */
export const submitQuiz = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slug } = req.params;
    const { answers, userId, sessionId } = req.body;

    // Track quiz start event
    try { await trackAnalytics(slug, 'quiz_start', { user_id: userId || null, session_id: sessionId || null, timestamp: new Date() }); } catch (e) { }

    // Fetch quiz
    const result = await query(
      'SELECT quiz_data FROM quizzes WHERE slug = $1 AND status = $2',
      [slug, 'published']
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        error: 'Quiz not found',
        slug,
      });
      return;
    }

    const quiz = result.rows[0].quiz_data;

    // Track each question_answer event and build per-question feedback
    const perQuestionFeedback: any[] = [];
    for (const answer of answers) {
      try {
        await trackAnalytics(slug, 'question_answer', { user_id: userId || null, session_id: sessionId || null, question_id: answer.questionId, selected: answer.selectedOptions, timestamp: new Date() });
      } catch (e) { }

      // For trivia, compute immediate correctness for each answer
      const question = quiz.questions.find((q: any) => q.id === answer.questionId);
      if (question) {
        const isCorrect = question.options ? answer.selectedOptions.every((optId: string) => {
          const opt = question.options.find((o: any) => o.id === optId);
          return !!opt && opt.correct === true;
        }) : null;
        perQuestionFeedback.push({ questionId: answer.questionId, correct: isCorrect });
      }
    }

    // Calculate result based on quiz type
    const calculatedResult = calculateQuizResult(quiz, answers);

    // Track completion event and result_view
    try { await trackAnalytics(slug, 'quiz_completed', { user_id: userId || null, session_id: sessionId || null, outcome: calculatedResult.outcome_key, timestamp: new Date() }); } catch (e) { }
    try { await trackAnalytics(slug, 'result_view', { user_id: userId || null, session_id: sessionId || null, outcome: calculatedResult.outcome_key, timestamp: new Date() }); } catch (e) { }

    res.json({ ...calculatedResult, feedback: perQuestionFeedback });
  } catch (error) {
    next(error);
  }
};

/**
 * Calculate quiz result based on type
 */
function calculateQuizResult(quiz: any, answers: any[]): any {
  const { type, results, point_ranges } = quiz;

  if (type === 'personality') {
    // Weighted outcome calculation
    const scores: { [key: string]: number } = {};

    answers.forEach((answer) => {
      const question = quiz.questions.find((q: any) => q.id === answer.questionId);
      if (!question) return;

      answer.selectedOptions.forEach((optionId: string) => {
        const option = question.options.find((o: any) => o.id === optionId);
        if (option && option.map) {
          Object.entries(option.map).forEach(([outcome, weight]) => {
            scores[outcome] = (scores[outcome] || 0) + (weight as number);
          });
        }
      });
    });

    // Find highest scoring outcome
    const outcomeKey = Object.keys(scores).reduce((a, b) =>
      scores[a] > scores[b] ? a : b
    );

    return {
      outcome_key: outcomeKey,
      outcome: results[outcomeKey],
      scores,
      share_url: `${process.env.API_BASE_URL}/quiz/${quiz.slug}`,
      share_image: results[outcomeKey].image,
    };
  } else if (type === 'points') {
    // Points calculation
    let totalPoints = 0;

    answers.forEach((answer) => {
      const question = quiz.questions.find((q: any) => q.id === answer.questionId);
      if (!question) return;

      answer.selectedOptions.forEach((optionId: string) => {
        const option = question.options.find((o: any) => o.id === optionId);
        if (option && typeof option.points === 'number') {
          totalPoints += option.points;
        }
      });
    });

    // Find result by point range
    const range = point_ranges?.find(
      (r: any) => totalPoints >= r.min && totalPoints <= r.max
    );

    const outcomeKey = range?.result || Object.keys(results)[0];

    return {
      outcome_key: outcomeKey,
      outcome: results[outcomeKey],
      score: totalPoints,
      share_url: `${process.env.API_BASE_URL}/quiz/${quiz.slug}`,
      share_image: results[outcomeKey].image,
    };
  } else if (type === 'trivia') {
    // Trivia scoring
    let correctCount = 0;
    let totalQuestions = 0;

    answers.forEach((answer) => {
      const question = quiz.questions.find((q: any) => q.id === answer.questionId);
      if (!question) return;

      totalQuestions++;

      const isCorrect = answer.selectedOptions.every((optionId: string) => {
        const option = question.options.find((o: any) => o.id === optionId);
        return option?.correct === true;
      });

      if (isCorrect) correctCount++;
    });

    // Find result by score percentage
    const percentage = (correctCount / totalQuestions) * 100;
    const outcomeKey = getTriviOutcome(percentage, results);

    return {
      outcome_key: outcomeKey,
      outcome: results[outcomeKey],
      score: correctCount,
      total_possible: totalQuestions,
      percentage,
      share_url: `${process.env.API_BASE_URL}/quiz/${quiz.slug}`,
      share_image: results[outcomeKey].image,
    };
  }

  // Default fallback
  return {
    outcome_key: Object.keys(results)[0],
    outcome: results[Object.keys(results)[0]],
    share_url: `${process.env.API_BASE_URL}/quiz/${quiz.slug}`,
    share_image: results[Object.keys(results)[0]].image,
  };
}

/**
 * Get trivia outcome based on percentage
 */
function getTriviOutcome(percentage: number, results: any): string {
  if (percentage >= 90) return Object.keys(results)[0]; // Perfect
  if (percentage >= 70) return Object.keys(results)[1] || Object.keys(results)[0]; // Great
  if (percentage >= 50) return Object.keys(results)[2] || Object.keys(results)[0]; // Good
  return Object.keys(results)[3] || Object.keys(results)[0]; // Try again
}

/**
 * Track analytics event
 */
async function trackAnalytics(
  quizSlug: string,
  eventType: string,
  eventData: any
): Promise<void> {
  try {
    await query(
      `INSERT INTO quiz_analytics (quiz_slug, event_type, event_data, user_id, session_id, created_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        quizSlug,
        eventType,
        eventData,
        eventData.user_id || null,
        eventData.session_id || null,
        new Date(),
      ]
    );
  } catch (error) {
    console.error('Analytics tracking error:', error);
    // Don't throw - analytics failure shouldn't break the request
  }
}

/**
 * GET /api/quiz/:slug/related
 * Get related quizzes based on tags
 */
export const getRelatedQuizzes = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slug } = req.params;
    const { limit = '5' } = req.query;

    // Get current quiz to extract tags
    const currentQuiz = await query(
      'SELECT quiz_data FROM quizzes WHERE slug = $1 AND status = $2',
      [slug, 'published']
    );

    if (currentQuiz.rows.length === 0) {
      res.status(404).json({ error: 'Quiz not found' });
      return;
    }

    const tags = currentQuiz.rows[0].quiz_data.tags || [];

    if (tags.length === 0) {
      res.json({ quizzes: [] });
      return;
    }

    // Find quizzes with overlapping tags
    const result = await query(
      `SELECT id, slug, title, quiz_data->>'dek' as dek,
              quiz_data->>'hero_image' as hero_image,
              quiz_data->'tags' as tags
       FROM quizzes
       WHERE status = 'published'
         AND slug != $1
         AND quiz_data->'tags' ?| $2
       ORDER BY created_at DESC
       LIMIT $3`,
      [slug, tags, limit]
    );

    res.json({ quizzes: result.rows });
  } catch (error) {
    next(error);
  }
};
