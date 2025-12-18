import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const header = req.headers.authorization || '';
    if (!header) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const parts = header.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      res.status(401).json({ error: 'Invalid authorization header' });
      return;
    }

    const token = parts[1];

    // If an admin static token is set, allow it
    if (process.env.ADMIN_API_TOKEN && token === process.env.ADMIN_API_TOKEN) {
      req.user = { role: 'admin', tokenType: 'static' };
      next();
      return;
    }

    const secret = process.env.JWT_SECRET || 'change-me';
    try {
      const payload = jwt.verify(token, secret);
      req.user = payload;
      next();
    } catch (err) {
      res.status(401).json({ error: 'Invalid token' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Auth error' });
  }
};
