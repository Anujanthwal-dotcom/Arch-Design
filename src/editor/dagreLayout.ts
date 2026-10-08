import dagre from '@dagrejs/dagre';
import { Node, Edge, Position } from '@xyflow/react';

export const getNodeDimensions = (node: Node): { width: number; height: number } => {
  const width = node.measured?.width || 320;

  if (node.data?.isCollapsed) {
    return { width, height: node.measured?.height || 44 };
  }

  if (node.measured?.height) {
    return { width, height: node.measured.height };
  }

  // Estimate height based on content
  const data = node.data || {};
  let estimatedHeight = 120; // header + padding + description
  if (data.description) {
    estimatedHeight += 30;
  }
  if (data.subType) {
    estimatedHeight += 35;
  }
  if (Array.isArray(data.properties) && data.properties.length > 0) {
    estimatedHeight += data.properties.length * 60 + 35;
  }
  if (Array.isArray(data.parameters) && data.parameters.length > 0) {
    estimatedHeight += data.parameters.length * 55 + 35;
  }
  if (Array.isArray(data.returns) && data.returns.length > 0) {
    estimatedHeight += data.returns.length * 55 + 35;
  }

  return { width, height: Math.max(estimatedHeight, 160) };
};

/**
 * Applies Dagre hierarchical layout to resolve collisions and arrange nodes cleanly.
 * Default direction is Left-to-Right (LR) matching the Left-in Right-out handles.
 */
export const applyDagreLayout = (
  nodes: Node[],
  edges: Edge[],
  direction: 'LR' | 'TB' = 'LR'
): { nodes: Node[]; edges: Edge[] } => {
  if (nodes.length === 0) {
    return { nodes, edges };
  }

  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const isHorizontal = direction === 'LR';
  // With Child -> Parent edges, RL places root parents on the left and injected children on the right.
  // BT places root parents on the top and injected children on the bottom.
  const rankdir = isHorizontal ? 'RL' : 'BT';

  dagreGraph.setGraph({
    rankdir,
    nodesep: 60, // Minimum separation between adjacent nodes in the same rank
    ranksep: 100, // Minimum separation between ranks
    marginx: 60,
    marginy: 60,
  });

  nodes.forEach((node) => {
    const { width, height } = getNodeDimensions(node);
    dagreGraph.setNode(node.id, { width, height });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const dagreNode = dagreGraph.node(node.id);
    const { width, height } = getNodeDimensions(node);

    return {
      ...node,
      targetPosition: isHorizontal ? Position.Right : Position.Bottom,
      sourcePosition: isHorizontal ? Position.Left : Position.Top,
      position: {
        x: Math.round(dagreNode.x - width / 2),
        y: Math.round(dagreNode.y - height / 2),
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

/**
 * Nudges a dropped node if it collides with another node to ensure no overlap.
 */
export const resolveCollisionOnDrag = (droppedNode: Node, allNodes: Node[]): { x: number; y: number } => {
  const otherNodes = allNodes.filter((n) => n.id !== droppedNode.id);
  const { width: dWidth, height: dHeight } = getNodeDimensions(droppedNode);
  const PADDING = 20;

  let x = droppedNode.position.x;
  let y = droppedNode.position.y;

  let collisionFound = true;
  let attempts = 0;

  while (collisionFound && attempts < 20) {
    collisionFound = false;
    for (const other of otherNodes) {
      const { width: oWidth, height: oHeight } = getNodeDimensions(other);
      const overlapX = Math.abs(x - other.position.x) < (dWidth + oWidth) / 2 + PADDING;
      const overlapY = Math.abs(y - other.position.y) < (dHeight + oHeight) / 2 + PADDING;

      if (overlapX && overlapY) {
        collisionFound = true;
        // Shift downwards past the colliding node
        y = other.position.y + oHeight + PADDING;
        attempts++;
        break;
      }
    }
  }

  return { x, y };
};
