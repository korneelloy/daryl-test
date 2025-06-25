import axios from 'axios';
import { GraphData } from '../types';

export async function getGraphFromQuery(query: string): Promise<GraphData> {
  const apiKey = process.env.TAVILY_API_KEY;
  const response = await axios.post(
    'https://api.tavily.com/search',
    {
      query,
      search_depth: 'basic',
      include_answers: false,
      max_results: 14,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );

  const results = response.data.results;

  const nodes = [
    { id: query, label: query, type: 'query' },
    ...results.map((r: any, index: number) => ({
      id: `r${index}`,
      label: r.title || r.url,
      type: 'result',
      url: r.url,
    })),
  ];

  const edges = results.map((_: any, index: number) => ({
    from: query,
    to: `r${index}`,
  }));

  return { nodes, edges };
}
