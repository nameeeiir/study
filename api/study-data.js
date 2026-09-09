export default async function handler(req, res) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  const KEY = 'studyWarsData';

  if (!url || !token) {
    return res.status(500).json({ error: 'Upstash environment variables not connected.' });
  }

  if (req.method === 'GET') {
    const response = await fetch(`${url}/get/${KEY}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const result = await response.json();
    const data = result.result ? JSON.parse(result.result) : { you: 0, friend: 0, history: [], days: {} };
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const bodyStr = JSON.stringify(req.body);
    await fetch(`${url}/set/${KEY}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(bodyStr)
    });
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
