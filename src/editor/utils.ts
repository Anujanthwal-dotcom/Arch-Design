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

  // service -> module (service injected into module)
  if (sourceType === 'service' && targetType === 'module') {
    return true;
  }

  // function -> service (function implements / registered into service)
  if (sourceType === 'function' && targetType === 'service') {
    return true;
  }

  // external -> service (external infrastructure injected into service)
  if (sourceType === 'external' && targetType === 'service') {
    return true;
  }

  // external -> module (external infrastructure injected into module)
  if (sourceType === 'external' && targetType === 'module') {
    return true;
  }

  // service -> service (dependency service injected into consumer service)
  if (sourceType === 'service' && targetType === 'service') {
    return true;
  }

  return false;
};