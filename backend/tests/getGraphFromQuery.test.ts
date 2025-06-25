import axios from 'axios';
import { getGraphFromQuery } from '../services/tavily';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getGraphFromQuery', () => {
  it('should return graph with nodes and edges', async () => {
    const mockResults = [
      { title: 'Result 1', url: 'http://example.com/1' },
      { title: 'Result 2', url: 'http://example.com/2' },
    ];
    
    mockedAxios.post.mockResolvedValue({
      data: {
        results: mockResults
      }
    });

    const query = 'test query';
    const graph = await getGraphFromQuery(query);

    // Vérifier que le graphe a bien des noeuds et edges
    expect(graph.nodes.length).toBe(mockResults.length + 1); // +1 pour le noeud central (query)
    expect(graph.edges.length).toBe(mockResults.length);

    // Vérifier le noeud central
    expect(graph.nodes[0]).toMatchObject({ id: query, label: query, type: 'query' });

    // Vérifier un noeud résultat
    expect(graph.nodes[1]).toMatchObject({
      id: 'r0',
      label: mockResults[0].title,
      type: 'result',
      url: mockResults[0].url,
    });

    // Vérifier une arête
    expect(graph.edges[0]).toMatchObject({ from: query, to: 'r0' });
  });

  it('should throw if API call fails', async () => {
    mockedAxios.post.mockRejectedValue(new Error('API failure'));
    await expect(getGraphFromQuery('fail query')).rejects.toThrow('API failure');
  });
});
