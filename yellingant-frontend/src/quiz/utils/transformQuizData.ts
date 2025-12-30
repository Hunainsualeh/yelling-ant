import type { QuizData, QuizQuestion, QuizResult, QuizAnswer } from '../types';

/**
 * Transform backend quiz data format to frontend format.
 * 
 * Backend format differences:
 * - results: object keyed by type { "Merida": {...}, "Cinderella": {...} }
 * - questions[].text instead of questions[].question
 * - options[].map for personality scoring instead of options[].personalityType
 * 
 * Frontend expects:
 * - results: array of QuizResult
 * - questions[].question
 * - options[].personalityType
 */
export function transformQuizData(backendData: any): QuizData {
  if (!backendData) return backendData;

  // Transform results from object to array
  let resultsArray: QuizResult[] = [];
  if (backendData.results) {
    if (Array.isArray(backendData.results)) {
      // Already an array, just ensure proper format
      resultsArray = backendData.results.map((r: any, idx: number) => ({
        id: r.id || `result-${idx}`,
        type: r.type || r.id || `type-${idx}`,
        title: r.title || '',
        description: r.description || '',
        image: r.image || '',
        shareText: r.shareText || '',
      }));
    } else if (typeof backendData.results === 'object') {
      // Convert object to array
      resultsArray = Object.entries(backendData.results).map(([key, value]: [string, any], idx) => ({
        id: value.id || `result-${idx}`,
        type: key,
        title: value.title || key,
        description: value.description || '',
        image: value.image || '',
        shareText: value.shareText || '',
      }));
    }
  }

  // Transform questions
  const transformedQuestions: QuizQuestion[] = (backendData.questions || []).map((q: any, qIdx: number) => {
    // Transform options - handle personality maps
    const transformedOptions: QuizAnswer[] = (q.options || []).map((opt: any, optIdx: number) => {
      // Determine personalityType from map if exists
      let personalityType: string | undefined;
      if (opt.map && typeof opt.map === 'object') {
        // Find the key with highest value in map
        const mapEntries = Object.entries(opt.map) as [string, number][];
        if (mapEntries.length > 0) {
          personalityType = mapEntries.sort((a, b) => b[1] - a[1])[0][0];
        }
      } else if (opt.personalityType) {
        personalityType = opt.personalityType;
      }

      return {
        id: opt.id || `opt-${qIdx}-${optIdx}`,
        text: opt.text || opt.label || '',
        image: opt.image,
        label: opt.label || opt.text,
        personalityType,
        score: opt.score,
        correct: opt.correct,
      };
    });

    return {
      id: q.id || qIdx,
      question: q.question || q.text || '',
      text: q.text || q.question,
      image: q.image,
      options: transformedOptions,
      type: q.type || 'single',
      correctAnswer: q.correctAnswer || q.correct_answer,
      feedback: q.feedback,
      sliderMin: q.sliderMin,
      sliderMax: q.sliderMax,
      sliderMinLabel: q.sliderMinLabel,
      sliderMaxLabel: q.sliderMaxLabel,
    };
  });

  return {
    id: backendData.id || 0,
    slug: backendData.slug || '',
    title: backendData.title || '',
    description: backendData.description || backendData.dek || '',
    heroImage: backendData.heroImage || backendData.hero_image || '',
    totalQuestions: transformedQuestions.length,
    questions: transformedQuestions,
    results: resultsArray,
    type: backendData.type || 'personality',
  };
}

export default transformQuizData;
