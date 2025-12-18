import { Request, Response, NextFunction } from 'express';
import { getRedis } from '../config/redis';

export const cacheMiddleware = (ttlSeconds: number) => {

  return async (req: Request, res: Response, next: NextFunction) => {
    const redis = getRedis();
    try {
      if (req.method !== 'GET') return next();

      const key = `cache:${req.originalUrl}`;

      let cached: string | null = null;
      try {
        cached = await redis.get(key);
      } catch (e) {
        // Redis not available — skip cache
      }
      if (cached) {
        const parsed = JSON.parse(cached);
        res.set(parsed.headers || {});
        res.status(parsed.status || 200).json(parsed.body);
        return;
      }

      // Patch res.json to cache response
      const originalJson = res.json.bind(res);
      // assign via `res as any` to avoid strict typing issues when patching
      (res as any).json = async function (body: any) {
        try {
          const payload = {
            status: res.statusCode,
            headers: res.getHeaders ? res.getHeaders() : {},
            body,
          };
          try {
            await redis.set(key, JSON.stringify(payload), 'EX', ttlSeconds);
          } catch (e) {
            // ignore cache set errors
          }
        } catch (err) {
          // ignore caching errors
        }
        return originalJson(body);
      };

      next();
    } catch (error) {
      next();
    }
  };
};
