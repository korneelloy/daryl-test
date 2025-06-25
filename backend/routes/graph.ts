import express, { Request, Response } from 'express';
import { getGraphFromQuery } from '../services/tavily';
import cache from '../cache';

const router = express.Router();

router.get('/', async (req: Request, res: Response): Promise<void> => {
  const queryParam = req.query.query;
  const query = Array.isArray(queryParam) ? queryParam[0] : queryParam;

  if (!query || typeof query !== 'string' || query.trim() === '') {
    res.status(400).json({ message: 'Missing or invalid query parameter' });
    return;
  }

  const trimmedQuery = query.trim();
  
  const cached = await cache.get(trimmedQuery);
  if (cached) {
    res.json(cached);
    return;
  }

  try {
    const graph = await getGraphFromQuery(trimmedQuery);
    const response = {
      graph,
      componentUrl: "/components/result-graph.js",
    };
    
    await cache.set(trimmedQuery, response, 900); 
    res.json(response);
    return;
    
  } catch (err: unknown) {
    console.error('Error fetching graph:', err);

    if (err && typeof err === 'object' && 'response' in err) {
      const httpError = err as { response?: { status?: number } };
      
      if (httpError.response?.status === 429) {
        res.status(503).json({ 
          message: 'Tavily quota exceeded. Please try again later.' 
        });
        return;
      }
      
      if (httpError.response?.status === 401) {
        res.status(503).json({ 
          message: 'Tavily authentication failed' 
        });
        return;
      }
    }
    
    console.error('Tavily API error:', err);
    res.status(503).json({ 
      message: 'Failed to fetch data from Tavily. Please try again later.' 
    });
  }
});

export default router;
