import { DataSet, Network } from 'https://unpkg.com/vis-network@9.1.2/standalone/esm/vis-network.js';

class ResultGraph extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }); 
    const style = document.createElement('style');
    style.textContent = `
      .graph-container {
        width: 100%;
        height: 600px;
        border: 2px solid #e5e7eb; /* Tailwind border-gray-300 */
        border-radius: 1rem; /* Tailwind rounded-2xl */
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Tailwind shadow-md */
        background-color: white;
      }
    `;
    this.container = document.createElement('div');
    this.container.classList.add('graph-container');
    this.shadowRoot.appendChild(style);

    this.shadowRoot.appendChild(this.container);
    this.network = null;
  }

  set data(graphData) {
    if (!graphData) return;

    const nodes = new DataSet(
      graphData.nodes.map(n => ({
        id: n.id,
        label: n.label,
        title: n.label, 
        url: n.url || '',
        
        shape: n.type === 'query' ? 'ellipse' : 'box',
        color: n.type === 'query' ? '#6366F1' : '#FFFFFF',
        font: { color: n.type === 'query' ? '#FFF' : '#000' },
        level: n.type === 'query' ? 2 : 1,
      }))
    );

    const edges = new DataSet(graphData.edges);

    const data = { nodes, edges };
    const options = {
      nodes: {
        shape: 'dot',
        size: 20,
        font: { size: 16 },
      },
      interaction: {
        hover: true,
        tooltipDelay: 100,
      },
      physics: {
        enabled: true,
        stabilization: {
          iterations: 200,
        },
        barnesHut: {
          gravitationalConstant: -3000, 
          springLength: 250,
          springConstant: 0.05,
          damping: 0.09,
        },
      },
    };

    this.network = new Network(this.container, data, options);

    this.network.on('click', (params) => {
      const nodeId = params.nodes[0];
      if (nodeId) {
        const node = nodes.get(nodeId);
        if (node.url) {
          window.open(node.url, '_blank');
        }
      }
    });
  }
}

customElements.define('result-graph', ResultGraph);
