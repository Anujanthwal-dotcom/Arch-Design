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

  // module -> module (submodule is part of / injected into parent module)
  if (sourceType === 'module' && targetType === 'module') {
    return true;
  }

  // Frontend & Mobile:
  // component -> component (UI composition: parent renders child)
  if (sourceType === 'component' && targetType === 'component') {
    return true;
  }

  // service -> component (ViewModel / Store / Hook provides state to component)
  if (sourceType === 'service' && targetType === 'component') {
    return true;
  }

  // component -> service (Component dispatches actions / uses service or ViewModel)
  if (sourceType === 'component' && targetType === 'service') {
    return true;
  }

  // component -> module (Component belongs to a feature module or screen group)
  if (sourceType === 'component' && targetType === 'module') {
    return true;
  }

  // function -> component (Helper function or event handler used by component)
  if (sourceType === 'function' && targetType === 'component') {
    return true;
  }

  // Systems & Data Types (Rust, TypeScript, Swift, Kotlin):
  // type -> type (Struct implements Trait, or Interface inheritance)
  if (sourceType === 'type' && targetType === 'type') {
    return true;
  }

  // type -> service (Model / DTO / Entity used by service)
  if (sourceType === 'type' && targetType === 'service') {
    return true;
  }

  // type -> component (Model / Props contract used by component)
  if (sourceType === 'type' && targetType === 'component') {
    return true;
  }

  // type -> function (Model used as parameter/return contract)
  if (sourceType === 'type' && targetType === 'function') {
    return true;
  }

  // type -> module (Type declared within module / crate)
  if (sourceType === 'type' && targetType === 'module') {
    return true;
  }

  // function -> type (Method implemented on struct / trait)
  if (sourceType === 'function' && targetType === 'type') {
    return true;
  }

  return false;
};

export const resolveEdgeType = (sourceType: string, targetType: string): string => {
  if (sourceType === 'function' && targetType === 'service') return 'implements';
  if (sourceType === 'function' && targetType === 'type') return 'implements';
  if (sourceType === 'function' && targetType === 'component') return 'helper';
  if (sourceType === 'type' && targetType === 'type') return 'implements';
  if (sourceType === 'type' && (targetType === 'service' || targetType === 'component' || targetType === 'function')) return 'defines';
  if (sourceType === 'type' && targetType === 'module') return 'declares';
  if (sourceType === 'module' && targetType === 'module') return 'submodule';
  if (sourceType === 'component' && targetType === 'component') return 'renders';
  if (sourceType === 'service' && targetType === 'component') return 'observes';
  if (sourceType === 'component' && targetType === 'service') return 'uses';
  if (sourceType === 'component' && targetType === 'module') return 'belongsTo';
  return 'injects';
};