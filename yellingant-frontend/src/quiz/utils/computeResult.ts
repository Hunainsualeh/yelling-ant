import type { QuizData, QuizResult, AnswerSummary } from '../types';

// Dynamic result titles based on quiz type and performance
const TRIVIA_RESULT_TITLES = {
  perfect: ['Quiz Master!', 'Flawless Victory!', 'Genius Level!', 'You Nailed It!'],
  excellent: ['Amazing!', 'Impressive!', 'Outstanding!', 'Brilliant!'],
  good: ['Great Job!', 'Well Done!', 'Nice Work!', 'Solid Performance!'],
  average: ['Not Bad!', 'Good Effort!', 'Keep Learning!', 'Room to Grow!'],
  poor: ['Keep Trying!', 'Better Luck Next Time!', 'Practice Makes Perfect!', 'Don\'t Give Up!'],
};

const PERSONALITY_RESULT_PREFIXES = [
  'You Are',
  'Your Result:',
  'You\'re Totally',
  'Your Vibe:',
];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getTriviaResultTitle(percentScore: number): string {
  if (percentScore === 100) return getRandomItem(TRIVIA_RESULT_TITLES.perfect);
  if (percentScore >= 80) return getRandomItem(TRIVIA_RESULT_TITLES.excellent);
  if (percentScore >= 60) return getRandomItem(TRIVIA_RESULT_TITLES.good);
  if (percentScore >= 40) return getRandomItem(TRIVIA_RESULT_TITLES.average);
  return getRandomItem(TRIVIA_RESULT_TITLES.poor);
}

function getTriviaResultDescription(correctAnswers: number, totalQuestions: number, percentScore: number): string {
  if (percentScore === 100) {
    return `Perfect score! You got all ${totalQuestions} questions right. You're a true expert!`;
  }
  if (percentScore >= 80) {
    return `Excellent! You got ${correctAnswers} out of ${totalQuestions} correct. You really know your stuff!`;
  }
  if (percentScore >= 60) {
    return `Good job! You scored ${correctAnswers} out of ${totalQuestions}. You have solid knowledge!`;
  }
  if (percentScore >= 40) {
    return `You got ${correctAnswers} out of ${totalQuestions} correct. There's always room to learn more!`;
  }
  return `You got ${correctAnswers} out of ${totalQuestions}. Why not try again and see if you can improve?`;
}

// Generate answer summaries for all quiz types
export function generateAnswerSummaries(
  quizData: QuizData,
  answers: Record<number, string | string[]>,
  includeCorrectWrong: boolean = true
): AnswerSummary[] {
  const summaries: AnswerSummary[] = [];
  
  Object.entries(answers).forEach(([qIndex, answerId]) => {
    const questionIndex = parseInt(qIndex, 10);
    const question = quizData.questions[questionIndex];
    if (!question) return;
    
    const selectedOption = question.options?.find(o => o.id === answerId);
    const correctOption = question.options?.find(o => o.correct);
    
    // Only calculate correct/wrong for trivia-type quizzes
    let isCorrect: boolean | undefined = undefined;
    if (includeCorrectWrong) {
      if (question.type === 'text-input' && typeof answerId === 'string' && question.correctAnswer) {
        isCorrect = String(question.correctAnswer).trim().toLowerCase() === answerId.trim().toLowerCase();
      } else if (question.correctAnswer === answerId) {
        isCorrect = true;
      } else if (selectedOption?.correct) {
        isCorrect = true;
      } else if (correctOption) {
        // Only mark as incorrect if there was a correct option defined
        isCorrect = false;
      }
      // If no correct option defined (personality quiz), leave isCorrect undefined
    }
    
    summaries.push({
      questionIndex,
      questionText: question.question || question.text || `Question ${questionIndex + 1}`,
      selectedAnswer: selectedOption?.text || selectedOption?.label || String(answerId),
      correctAnswer: correctOption?.text || String(question.correctAnswer || ''),
      isCorrect,
      questionImage: question.image,
    });
  });
  
  return summaries;
}

export function computeResult(
  quizData: QuizData,
  answers: Record<number, string | string[]>
): QuizResult & { answerSummaries?: AnswerSummary[] } {
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

  // PERSONALITY QUIZ - Match based on personality types
  if (quizData.type === 'personality') {
    const typeCounts: Record<string, number> = {};
    // Generate summaries for personality quiz (no correct/wrong)
    const answerSummaries = generateAnswerSummaries(quizData, answers, false);
    
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
        r.title?.toLowerCase().includes(dominantType.toLowerCase())
      );
      if (foundResult) {
        return {
          ...foundResult,
          // Optionally prefix with a dynamic phrase
          title: foundResult.title.startsWith('You') ? foundResult.title : `${getRandomItem(PERSONALITY_RESULT_PREFIXES)} ${foundResult.title}`,
          answerSummaries,
        };
      }
    }
    
    return { ...defaultResult, answerSummaries };
  }

  // TRIVIA / SCORED QUIZ - Calculate score and generate dynamic results
  if (quizData.type === 'scored' || quizData.type === 'trivia') {
    let correctAnswers = 0;
    const answerSummaries = generateAnswerSummaries(quizData, answers);
    
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

      // Check if option is marked as correct
      const selectedOption = question.options?.find(o => o.id === answerId);
      if (selectedOption?.correct || question.correctAnswer === answerId) {
        correctAnswers++;
      }
    });

    const percentScore = Math.round((correctAnswers / quizData.questions.length) * 100);
    
    // Check if we have predefined results with score ranges
    const resultWithScoreRange = resultsArray.find(r => {
      if (r.minScore !== undefined && r.maxScore !== undefined) {
        return percentScore >= r.minScore && percentScore <= r.maxScore;
      }
      return false;
    });
    
    if (resultWithScoreRange) {
      return { ...resultWithScoreRange, answerSummaries };
    }

    // Generate dynamic result based on score
    const dynamicTitle = getTriviaResultTitle(percentScore);
    const dynamicDescription = getTriviaResultDescription(correctAnswers, quizData.questions.length, percentScore);
    
    // Find best matching result from predefined results by score range
    if (resultsArray.length > 1) {
      const scoreRanges = resultsArray.map((r, i) => ({ 
        result: r, 
        minScore: i * Math.ceil(100 / resultsArray.length) 
      }));
      const appropriate = scoreRanges.reverse().find(({ minScore }) => percentScore >= minScore);
      if (appropriate) {
        return {
          ...appropriate.result,
          // Use predefined title if it's not generic, otherwise use dynamic
          title: appropriate.result.title && !['Great Job!', 'Quiz Complete!', 'Good Work!'].includes(appropriate.result.title) 
            ? appropriate.result.title 
            : dynamicTitle,
          description: appropriate.result.description || dynamicDescription,
          answerSummaries,
        };
      }
    }

    return {
      ...defaultResult,
      title: dynamicTitle,
      description: dynamicDescription,
      answerSummaries,
    };
  }

  // THIS-THAT / IMAGE-OPTIONS - Summarize choices
  if (quizData.type === 'this-that' || quizData.type === 'image-options') {
    // Generate summaries - check if it has correct answers (trivia) or not (personality)
    const hasCorrectAnswers = quizData.questions.some(q => q.options?.some(o => o.correct));
    const answerSummaries = generateAnswerSummaries(quizData, answers, hasCorrectAnswers);
    
    // Count choices and create a summary
    const choiceSummary: Record<string, number> = {};
    
    Object.values(answers).forEach((answerId) => {
      const answer = quizData.questions
        .flatMap((q) => q.options)
        .find((opt) => opt && opt.id === answerId);
      
      const label = answer?.label || answer?.text || String(answerId);
      choiceSummary[label] = (choiceSummary[label] || 0) + 1;
    });
    
    // Find most common choice pattern if personality mapping exists
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
    if (dominantType) {
      const foundResult = resultsArray.find((r) => 
        r.type?.toLowerCase() === dominantType.toLowerCase()
      );
      if (foundResult) return { ...foundResult, answerSummaries };
    }
    
    return { ...defaultResult, answerSummaries };
  }

  // Generate summaries for any other quiz type
  const answerSummaries = generateAnswerSummaries(quizData, answers, true);
  return { ...defaultResult, answerSummaries };
}

export default computeResult;
