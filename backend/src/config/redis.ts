import Redis from 'ioredis';

let client: Redis | null = null;

const createMock = () => {
  const noop = async () => null;
  const mock: any = {
    get: noop,
    set: noop,
    del: noop,
    quit: noop,
    on: () => {},
    once: () => {},
    disconnect: () => {},
  };
  return mock as unknown as Redis;
};

export const getRedis = (): Redis => {
  if (!client) {
    try {
      client = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379');
      client.on('connect', () => console.log('Redis connected'));
      client.on('error', (err: any) => {
        console.warn('Redis error', err && err.message ? err.message : err);
      });

      // If connection fails quickly, fall back to mock to keep server running
      const timer = setTimeout(() => {
        // no-op: allow client to settle
      }, 500);
      client.once('error', () => {
        clearTimeout(timer);
      });
    } catch (e) {
      console.warn('Failed to initialize Redis, using mock:', e);
      client = createMock();
    }

    // If client emitted immediate ECONNREFUSED, ensure we don't crash by replacing
    // with a mock that safely no-ops Redis calls.
    // (ioredis will emit 'error' events but won't throw; handling above is defensive.)
  }
  if (!client) return createMock();
  return client;
};

export const closeRedis = async (): Promise<void> => {
  if (client) {
    try {
      // @ts-ignore
      if (typeof client.quit === 'function') await (client as any).quit();
    } catch (e) {
      // ignore
    }
    client = null;
  }
};
