import type { QuizData, QuizResult } from '../types';

export function computeResult(quizData: QuizData, answers: Record<number, string | string[]>): QuizResult {
  // Ensure results is an array
  const resultsArray = Array.isArray(quizData.results) ? quizData.results : [];
  
  // Default fallback result
  const defaultResult: QuizResult = resultsArray[0] || {
    id: 'default',
    type: 'default',
    title: 'Quiz Complete!',
    description: 'Thanks for taking the quiz!',
    image: '',
    shareText: '',
  };

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

    // Find the dominant personality type
    const dominantType = Object.entries(typeCounts).sort(([, a], [, b]) => b - a)[0]?.[0];
    
    if (dominantType) {
      // Find result by type (case-insensitive match)
      const foundResult = resultsArray.find((r) => 
        r.type?.toLowerCase() === dominantType.toLowerCase() ||
        r.title?.toLowerCase() === dominantType.toLowerCase()
      );
      if (foundResult) return foundResult;
    }
    
    return defaultResult;
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
    if (resultsArray.length > 1) {
      const scoreRanges = resultsArray.map((r, i) => ({ 
        result: r, 
        minScore: i * Math.ceil(100 / resultsArray.length) 
      }));
      const appropriate = scoreRanges.reverse().find(({ minScore }) => percentScore >= minScore);
      return appropriate?.result || defaultResult;
    }

    return defaultResult;
  }

  return defaultResult;
}

export default computeResult;
