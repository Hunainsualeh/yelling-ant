import { Request, Response, NextFunction } from 'express';
import { query } from '../config/database';

/**
 * GET /api/share/:slug/card
 * Generate or return a share card URL for the quiz.
 * Minimal implementation returns a placeholder URL.
 */
export const generateShareCard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slug } = req.params;
    // Fetch quiz title and hero image (allow drafts for preview endpoints elsewhere)
    const result = await query(`SELECT quiz_data->>'title' as title, quiz_data->>'hero_image' as hero_image FROM quizzes WHERE slug = $1`, [slug]);
    const quiz = result.rows[0] || {};

    const title = quiz.title || `Take this quiz`;
    const hero = quiz.hero_image || null;

    // Generate simple SVG-based share image and convert to PNG
    const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#111827" />
      <style>
        .title { fill: #ffffff; font-size: 48px; font-family: Arial, Helvetica, sans-serif; }
      </style>
      <text x="60" y="320" class="title">${escapeXml(title)}</text>
    </svg>`;

    const sharp = require('sharp');
    const fileName = `${Date.now()}-${slug}-share.png`;
    const outDir = require('path').join(process.cwd(), 'uploads');
    if (!require('fs').existsSync(outDir)) require('fs').mkdirSync(outDir, { recursive: true });
    const outPath = require('path').join(outDir, fileName);

    await sharp(Buffer.from(svg)).png().toFile(outPath);

    const base = process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
    const cardUrl = `${base}/uploads/${fileName}`;

    res.json({ slug, card_url: cardUrl, generated: true });
  } catch (error) {
    next(error);
  }
};

function escapeXml(s: string) {
  return (s || '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c] as string));
}
