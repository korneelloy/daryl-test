import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379'),
});


const PREFIX = 'tavily-query:'; 

const cache = {
  async get(key: string): Promise<any | null> {
    const data = await redis.get(PREFIX + key);
    return data ? JSON.parse(data) : null;
  },

  async set(key: string, value: any, ttlSeconds: number): Promise<void> {
    await redis.set(PREFIX + key, JSON.stringify(value), 'EX', ttlSeconds);
  },

  flushall: () => redis.flushall(),
  quit: () => redis.quit(),
};

export default cache;
