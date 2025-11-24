import { Request, Response, NextFunction } from 'express';

/**
 * Validate quiz submission data
 */
export const validateQuizSubmission = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { answers } = req.body;

  if (!answers || !Array.isArray(answers)) {
    res.status(400).json({
      error: 'Validation Error',
      message: 'answers must be an array',
    });
    return;
  }

  if (answers.length === 0) {
    res.status(400).json({
      error: 'Validation Error',
      message: 'At least one answer is required',
    });
    return;
  }

  // Validate each answer
  for (const answer of answers) {
    if (!answer.questionId || typeof answer.questionId !== 'string') {
      res.status(400).json({
        error: 'Validation Error',
        message: 'Each answer must have a valid questionId',
      });
      return;
    }

    if (!answer.selectedOptions || !Array.isArray(answer.selectedOptions)) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'Each answer must have a selectedOptions array',
      });
      return;
    }

    if (answer.selectedOptions.length === 0) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'Each answer must have at least one option selected',
      });
      return;
    }
  }

  next();
};
