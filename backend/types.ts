export interface Node {
  id: string;
  label: string;
  type: 'query' | 'result';
}

export interface Edge {
  from: string;
  to: string;
}

export interface GraphData {
  nodes: Node[];
  edges: Edge[];
}
