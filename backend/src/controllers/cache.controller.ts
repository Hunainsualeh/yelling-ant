import { Request, Response, NextFunction } from 'express';
import { getRedis } from '../config/redis';

export const clearCache = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { pattern } = req.body;
    const redis = getRedis();

    if (!pattern) {
      res.status(400).json({ error: 'pattern is required' });
      return;
    }

    const keys = await redis.keys(`*${pattern}*`);
    if (keys.length > 0) {
      await redis.del(...keys);
    }

    res.json({ message: 'Cache cleared', keys_cleared: keys.length });
  } catch (error) {
    next(error);
  }
};

export const getCacheStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const redis = getRedis();
    try {
      const info = await redis.info();
      res.json({ info });
    } catch (e) {
      res.status(503).json({ error: 'Redis not available' });
    }
  } catch (error) {
    next(error);
  }
};
