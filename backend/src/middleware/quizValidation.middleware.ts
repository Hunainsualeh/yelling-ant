import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const optionSchema = Joi.object({
  id: Joi.string().required(),
  text: Joi.string().allow('').optional(),
  label: Joi.string().allow('').optional(), // For image options display label
  points: Joi.number().optional(),
  correct: Joi.boolean().optional(),
  map: Joi.object().pattern(Joi.string(), Joi.number()).optional(),
  image: Joi.string().allow('').optional(),
  personalityType: Joi.string().allow('').optional(), // For personality quizzes
  score: Joi.number().optional(),
});

const questionSchema = Joi.object({
  id: Joi.alternatives().try(Joi.string(), Joi.number()).required(), // Accept string or number
  text: Joi.string().allow('').optional(),
  question: Joi.string().allow('').optional(), // Alternative field name
  type: Joi.string().valid('single', 'multiple', 'image-options', 'image-choice', 'text-input', 'slider', 'figma-image', 'personality', 'text').optional(),
  options: Joi.array().items(optionSchema).optional(), // Made optional for text-input/slider types
  shuffle_options: Joi.boolean().optional(),
  shuffle: Joi.boolean().optional(),
  points: Joi.number().optional(),
  image: Joi.string().allow('').optional(),
  media: Joi.array().items(Joi.string()).optional(),
  correctAnswer: Joi.string().allow('').optional(), // For text-input type
  sliderMin: Joi.number().optional(), // For slider type
  sliderMax: Joi.number().optional(),
  sliderMinLabel: Joi.string().allow('').optional(),
  sliderMaxLabel: Joi.string().allow('').optional(),
  feedback: Joi.object({
    correct: Joi.string().allow('').optional(),
    incorrect: Joi.string().allow('').optional(),
  }).optional(),
});

const resultSchema = Joi.object({
  id: Joi.string().optional(),
  type: Joi.string().allow('').optional(), // For matching personality types
  title: Joi.string().required(),
  description: Joi.string().allow('').optional(),
  image: Joi.string().allow('').optional(),
  min_score: Joi.number().optional(),
  shareText: Joi.string().allow('').optional(),
});

const quizSchema = Joi.object({
  title: Joi.string().required(),
  slug: Joi.string().optional(),
  description: Joi.string().allow('').optional(), // Alternative to dek
  dek: Joi.string().allow('').optional(),
  type: Joi.string().valid('personality', 'points', 'trivia', 'scored', 'image-options', 'figma-image').required(),
  primary_colony: Joi.string().optional(),
  secondary_colonies: Joi.array().items(Joi.string()).optional(),
  hero_image: Joi.string().allow('').optional(),
  heroImage: Joi.string().allow('').optional(), // Alternative field name
  images_base: Joi.string().allow('').optional(),
  totalQuestions: Joi.number().optional(),
  questions: Joi.array().items(questionSchema).min(1).required(),
  // Accept results as either object or array
  results: Joi.alternatives().try(
    Joi.object().pattern(Joi.string(), resultSchema),
    Joi.array().items(resultSchema)
  ).required(),
  tags: Joi.array().items(Joi.string()).optional(),
  theme: Joi.object().optional(),
  ad_slots: Joi.object().optional(),
  category: Joi.string().optional(),
  scoring: Joi.string().optional(),
  settings: Joi.object().optional(),
}).unknown(true);

export const validateQuizPayload = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = quizSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({ success: false, error: 'Validation Error', details: error.details.map(d => d.message) });
    return;
  }
  next();
};
