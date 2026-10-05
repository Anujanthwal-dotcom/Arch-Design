import { v4 as uuidv4 } from 'uuid';
import { Node, Edge, Connection } from '@xyflow/react';

export const generateId = () => uuidv4();

export const checkValidConnection = (
  connection: Connection | Edge,
  nodes: Node[],
  edges: Edge[] = []
): boolean => {
  if (!connection.source || !connection.target) {
    return false;
  }

  if (connection.source === connection.target) {
    return false;
  }

  // Prevent duplicate edges between the same source and target
  const alreadyConnected = edges.some(
    (e) => e.source === connection.source && e.target === connection.target
  );
  if (alreadyConnected) {
    return false;
  }

  const sourceNode = nodes.find((n) => n.id === connection.source);
  const targetNode = nodes.find((n) => n.id === connection.target);

  const sourceType = sourceNode?.data?.nodeType || sourceNode?.type;
  const targetType = targetNode?.data?.nodeType || targetNode?.type;

  if (!sourceType || !targetType) {
    return false;
  }

  // module -> service
  if (sourceType === 'module' && targetType === 'service') {
    return true;
  }

  // service -> function
  if (sourceType === 'service' && targetType === 'function') {
    return true;
  }

  // service -> external
  if (sourceType === 'service' && targetType === 'external') {
    return true;
  }

  // module -> external
  if (sourceType === 'module' && targetType === 'external') {
    return true;
  }

  return false;
};