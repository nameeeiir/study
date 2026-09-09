export default async function handler(req, res) {
  // Checks both Vercel KV and Upstash default variable names
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_READ_ONLY_TOKEN || process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  const KEY = 'studyWarsData';

  if (!url || !token) {
    return res.status(500).json({ 
      error: 'Database credentials not found. Make sure Upstash/KV is connected under the Storage tab.' 
    });
  }

  try {
    if (req.method === 'GET') {
      const response = await fetch(`${url}/get/${KEY}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await response.json();
      
      let data = { you: 0, friend: 0, history: [], days: {} };
      if (result.result) {
        data = typeof result.result === 'string' ? JSON.parse(result.result) : result.result;
      }
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
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
