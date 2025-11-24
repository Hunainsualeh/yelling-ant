import { Request, Response, NextFunction } from 'express';
import { Quiz, QuizAnalytics } from '../config/mongodb';

/**
 * GET /api/quiz
 * List all published quizzes with MongoDB
 */
export const getQuizList = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { colony, tag, limit = '20', offset = '0' } = req.query;

    const filter: any = { status: 'published' };

    // Filter by colony
    if (colony) {
      filter.$or = [
        { 'metadata.primaryColony': colony },
        { 'metadata.secondaryColonies': colony },
      ];
    }

    // Filter by tag
    if (tag) {
      filter['metadata.tags'] = tag;
    }

    const quizzes = await Quiz.find(filter)
      .select('slug title description metadata.heroImage metadata.tags createdAt updatedAt')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit as string))
      .skip(parseInt(offset as string))
      .lean();

    const total = await Quiz.countDocuments(filter);

    res.json({
      quizzes,
      total,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/quiz/:slug
 * Get a specific quiz by slug
 */
export const getQuizBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slug } = req.params;

    const quiz = await Quiz.findOne({ slug, status: 'published' }).lean();

    if (!quiz) {
      res.status(404).json({
        error: 'Quiz not found',
        message: `No published quiz found with slug: ${slug}`,
      });
      return;
    }

    res.json(quiz);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/quiz/:slug/submit
 * Submit quiz answers and get result
 */
export const submitQuiz = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slug } = req.params;
    const { userId, answers } = req.body;

    // Get quiz
    const quiz = await Quiz.findOne({ slug, status: 'published' }).lean();

    if (!quiz) {
      res.status(404).json({
        error: 'Quiz not found',
        message: `No published quiz found with slug: ${slug}`,
      });
      return;
    }

    // Calculate result based on quiz type
    const result = calculateQuizResult(quiz, answers);

    // Track analytics
    await trackAnalytics(quiz._id.toString(), userId, answers, result);

    res.json({
      quizSlug: slug,
      quizTitle: quiz.title,
      result,
      submittedAt: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Calculate quiz result based on type
 */
function calculateQuizResult(quiz: any, answers: any[]): any {
  switch (quiz.type) {
    case 'personality':
      return calculatePersonalityResult(quiz, answers);
    case 'points':
      return calculatePointsResult(quiz, answers);
    case 'trivia':
      return calculateTriviaResult(quiz, answers);
    default:
      throw new Error(`Unsupported quiz type: ${quiz.type}`);
  }
}

/**
 * Personality Quiz: Weighted mapping
 */
function calculatePersonalityResult(quiz: any, answers: any[]): any {
  const scores: { [key: string]: number } = {};

  // Initialize all result scores to 0
  quiz.results.forEach((result: any) => {
    scores[result.id] = 0;
  });

  // Calculate scores based on weights
  answers.forEach((answer) => {
    const question = quiz.questions.find((q: any) => q.id === answer.questionId);
    if (!question) return;

    answer.selectedOptions.forEach((optionId: string) => {
      const option = question.options.find((opt: any) => opt.id === optionId);
      if (!option || !option.weight) return;

      // Add weights to scores
      Object.entries(option.weight).forEach(([resultId, weight]) => {
        if (scores[resultId] !== undefined) {
          scores[resultId] += weight as number;
        }
      });
    });
  });

  // Find highest scoring result
  const winningResultId = Object.entries(scores).reduce((a, b) =>
    b[1] > a[1] ? b : a
  )[0];

  const winningResult = quiz.results.find((r: any) => r.id === winningResultId);

  return {
    type: 'personality',
    outcome: winningResult,
    scores,
  };
}

/**
 * Points Quiz: Score ranges
 */
function calculatePointsResult(quiz: any, answers: any[]): any {
  let totalPoints = 0;

  answers.forEach((answer) => {
    const question = quiz.questions.find((q: any) => q.id === answer.questionId);
    if (!question) return;

    answer.selectedOptions.forEach((optionId: string) => {
      const option = question.options.find((opt: any) => opt.id === optionId);
      if (option && typeof option.points === 'number') {
        totalPoints += option.points;
      }
    });
  });

  // Find matching result based on score range
  const matchingResult = quiz.results.find(
    (result: any) =>
      totalPoints >= (result.minScore || 0) &&
      totalPoints <= (result.maxScore || Infinity)
  );

  return {
    type: 'points',
    score: totalPoints,
    outcome: matchingResult || quiz.results[quiz.results.length - 1],
  };
}

/**
 * Trivia Quiz: Correct/Incorrect
 */
function calculateTriviaResult(quiz: any, answers: any[]): any {
  let correctCount = 0;
  const totalQuestions = quiz.questions.length;

  answers.forEach((answer) => {
    const question = quiz.questions.find((q: any) => q.id === answer.questionId);
    if (!question) return;

    const selectedOption = question.options.find(
      (opt: any) => opt.id === answer.selectedOptions[0]
    );

    if (selectedOption && selectedOption.isCorrect) {
      correctCount++;
    }
  });

  const percentage = Math.round((correctCount / totalQuestions) * 100);

  // Find matching result based on percentage
  const matchingResult = quiz.results.find(
    (result: any) =>
      percentage >= (result.minScore || 0) &&
      percentage <= (result.maxScore || 100)
  );

  return {
    type: 'trivia',
    correctAnswers: correctCount,
    totalQuestions,
    percentage,
    outcome: matchingResult || quiz.results[quiz.results.length - 1],
  };
}

/**
 * Track analytics event
 */
async function trackAnalytics(
  quizId: string,
  userId: string,
  answers: any[],
  result: any
): Promise<void> {
  try {
    await QuizAnalytics.create({
      quizId,
      userId,
      eventType: 'quiz_completed',
      answers,
      result,
      metadata: {
        completedAt: new Date(),
        userAgent: 'API',
      },
    });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    // Don't throw - analytics shouldn't break the quiz flow
  }
}
