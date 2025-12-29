import type { QuizData, QuizResult } from '../types';

export function computeResult(quizData: QuizData, answers: Record<number, string | string[]>): QuizResult {

  if (quizData.type === 'personality') {
    const typeCounts: Record<string, number> = {};
    Object.values(answers).forEach((answerId) => {
      const answer = quizData.questions
        .flatMap((q) => q.options)
        .find((opt) => opt && opt.id === answerId);
      if (answer?.personalityType) {
        typeCounts[answer.personalityType] = (typeCounts[answer.personalityType] || 0) + 1;
      }
    });

    const dominantType = Object.entries(typeCounts).sort(([, a], [, b]) => b - a)[0]?.[0];
    return quizData.results.find((r) => r.type === dominantType) || quizData.results[0];
  }

  if (quizData.type === 'scored' || quizData.type === 'trivia') {
    let correctAnswers = 0;
    Object.entries(answers).forEach(([qIndex, answerId]) => {
      const question = quizData.questions[parseInt(qIndex, 10)];
      if (!question) return;

      // Text-input questions should compare normalized strings (case-insensitive)
      if (question.type === 'text-input' && typeof answerId === 'string' && question.correctAnswer) {
        const expected = String(question.correctAnswer).trim().toLowerCase();
        const given = String(answerId).trim().toLowerCase();
        if (expected === given) correctAnswers++;
        return;
      }

      if (question?.correctAnswer === answerId) {
        correctAnswers++;
      }
    });

    const percentScore = Math.round((correctAnswers / quizData.questions.length) * 100);

    // choose result bucket by score
    if (quizData.results.length > 1) {
      const scoreRanges = quizData.results.map((r, i) => ({ result: r, minScore: i * Math.ceil(100 / quizData.results.length) }));
      const appropriate = scoreRanges.reverse().find(({ minScore }) => percentScore >= minScore);
      return appropriate?.result || quizData.results[0];
    }

    return quizData.results[0];
  }

  return quizData.results[0];
}

export default computeResult;
