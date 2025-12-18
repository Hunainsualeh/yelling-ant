import { Request, Response, NextFunction } from 'express';
import { query } from '../config/database';

export const upsertBranching = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const { mappings } = req.body; // expected array of { question_id, answer_id, next_question_id }

    if (!Array.isArray(mappings)) {
      res.status(400).json({ error: 'mappings must be an array' });
      return;
    }

    for (const m of mappings) {
      await query(
        `INSERT INTO quiz_branching (quiz_slug, question_id, answer_id, next_question_id, created_at)
         VALUES ($1,$2,$3,$4,$5)`,
        [slug, m.question_id, m.answer_id, m.next_question_id || null, new Date()]
      );
    }

    res.json({ message: 'Branching mappings saved' });
  } catch (err) {
    next(err);
  }
};

export const getNextQuestionForAnswer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const { question_id, answer_id } = req.query as any;

    if (!question_id || !answer_id) {
      res.status(400).json({ error: 'question_id and answer_id required' });
      return;
    }

    const result = await query(
      `SELECT next_question_id FROM quiz_branching WHERE quiz_slug = $1 AND question_id = $2 AND answer_id = $3 ORDER BY id DESC LIMIT 1`,
      [slug, question_id, answer_id]
    );

    if (result.rows.length === 0) {
      res.json({ next_question_id: null });
      return;
    }

    res.json({ next_question_id: result.rows[0].next_question_id });
  } catch (err) {
    next(err);
  }
};
