import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  const KEY = 'studyWarsData';

  try {
    if (req.method === 'GET') {
      const data = await kv.get(KEY);
      return res.status(200).json(data || { you: 0, friend: 0, history: [], days: {} });
    }

    if (req.method === 'POST') {
      await kv.set(KEY, req.body);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
