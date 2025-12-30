import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const optionSchema = Joi.object({
  id: Joi.string().required(),
  text: Joi.string().allow('').optional(),
  points: Joi.number().optional(),
  correct: Joi.boolean().optional(),
  map: Joi.object().pattern(Joi.string(), Joi.number()).optional(),
  image: Joi.string().allow('').optional(),
});

const questionSchema = Joi.object({
  id: Joi.string().required(),
  text: Joi.string().allow('').required(),
  type: Joi.string().valid('single', 'multiple', 'image-options', 'text').optional(),
  options: Joi.array().items(optionSchema).min(1).required(),
  shuffle_options: Joi.boolean().optional(),
  shuffle: Joi.boolean().optional(),
  points: Joi.number().optional(),
  image: Joi.string().allow('').optional(),
  media: Joi.array().items(Joi.string()).optional(),
});

const resultSchema = Joi.object({
  id: Joi.string().optional(),
  title: Joi.string().required(),
  description: Joi.string().allow('').optional(),
  image: Joi.string().allow('').optional(),
  min_score: Joi.number().optional(),
});

const quizSchema = Joi.object({
  title: Joi.string().required(),
  slug: Joi.string().optional(),
  dek: Joi.string().allow('').optional(),
  type: Joi.string().valid('personality', 'points', 'trivia').required(),
  primary_colony: Joi.string().optional(),
  secondary_colonies: Joi.array().items(Joi.string()).optional(),
  hero_image: Joi.string().allow('').optional(),
  images_base: Joi.string().allow('').optional(),
  questions: Joi.array().items(questionSchema).min(1).required(),
  results: Joi.object().pattern(Joi.string(), resultSchema).required(),
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
