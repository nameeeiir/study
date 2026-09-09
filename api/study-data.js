import { Redis } from '@upstash/redis';

// Connects to Upstash Redis using environment variables automatically set by Vercel
const redis = Redis.fromEnv();

export default async function handler(req, res) {
  const KEY = 'studyWarsData';

  if (req.method === 'GET') {
    const data = await redis.get(KEY);
    return res.status(200).json(data || { you: 0, friend: 0, history: [], days: {} });
  }

  if (req.method === 'POST') {
    await redis.set(KEY, req.body);
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
