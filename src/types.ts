export type Position = {
  x: number;
  y: number;
};

export type Property = {
  id: string;
  title: string;
  description: string;
};

export type Parameter = {
  id: string;
  name: string;
  type: string;
  required: boolean;
  description: string;
};

export type Return = {
  id: string;
  name: string;
  type: string;
  required: boolean;
  description: string;
};

export type ArchitectureTier =
  | 'container'
  | 'presentation'
  | 'logic'
  | 'contract'
  | 'execution'
  | 'infrastructure';

export const resolveNodeTier = (
  type: string,
  explicitTier?: ArchitectureTier
): ArchitectureTier => {
  if (explicitTier) return explicitTier;
  const t = (type || '').toLowerCase();
  // Container tier
  if (['module', 'crate', 'package', 'feature'].includes(t)) return 'container';
  // Presentation tier
  if (['component', 'screen', 'view', 'page', 'composable', 'widget', 'modal', 'layout'].includes(t)) {
    return 'presentation';
  }
  // Logic tier
  if (
    [
      'service',
      'viewmodel',
      'store',
      'hook',
      'usecase',
      'coordinator',
      'controller',
      'interactor',
      'bloc',
      'manager',
    ].includes(t)
  ) {
    return 'logic';
  }
  // Contract / Data tier
  if (['type', 'struct', 'trait', 'model', 'entity', 'dao', 'schema', 'interface', 'enum', 'dto'].includes(t)) {
    return 'contract';
  }
  // Execution tier
  if (['function', 'method', 'endpoint', 'action', 'routine', 'rpc'].includes(t)) {
    return 'execution';
  }
  // Infrastructure tier
  if (['external', 'database', 'api', 'driver', 'hardware', 'runtime', 'channel', 'storage'].includes(t)) {
    return 'infrastructure';
  }
  return 'logic';
};

export type StandardNodeType = 'module' | 'service' | 'component' | 'type' | 'function' | 'external';
export type NodeType = StandardNodeType | string;

export type NodeDataBase = {
  label: string;
  description?: string;
  tier?: ArchitectureTier;
  properties: Property[];
  subType?: string;
  [key: string]: any;
};

export type ModuleNodeData = NodeDataBase;

export type ServiceNodeData = NodeDataBase & {
  typeRef?: string;
};

export type ComponentNodeData = NodeDataBase & {
  subType?: string; // screen | view | component | widget | page
};

export type TypeNodeData = NodeDataBase & {
  subType?: string; // struct | trait | enum | interface | model | schema
};

export type FunctionNodeData = NodeDataBase & {
  parameters: Parameter[];
  returns: Return[];
};

export type ExternalNodeData = NodeDataBase & {
  tech?: string;
};

export type ArchetypeNodeData = NodeDataBase & {
  typeRef?: string;
  parameters?: Parameter[];
  returns?: Return[];
  tech?: string;
};

export type NodeData =
  | ModuleNodeData
  | ServiceNodeData
  | ComponentNodeData
  | TypeNodeData
  | FunctionNodeData
  | ExternalNodeData
  | ArchetypeNodeData;

export type LLDNode = {
  id: string;
  type: NodeType;
  tier?: ArchitectureTier;
  label: string;
  pos: Position;
  description?: string;
  properties?: Property[];
  subType?: string;
  typeRef?: string;
  parameters?: Parameter[];
  returns?: Return[];
  tech?: string;
  isCollapsed?: boolean;
};

export type LLDNodeData = {
  id: string;
  type: NodeType;
  data: any;
  position: Position;
};

export type Edge = {
  id: string;
  from: string;
  to: string;
  type: string;
};

export type LLDEdge = {
  id: string;
  source: string;
  target: string;
  type: string;
};

export type DomainType =
  | 'universal'
  | 'backend'
  | 'frontend'
  | 'android'
  | 'ios'
  | 'systems'
  | 'mobile';

export type LLDDocument = {
  version: number;
  domain?: DomainType | string;
  framework?: string;
  name?: string;
  nodes: LLDNode[];
  edges: Edge[];
};

export type LLDFile = {
  version: number;
  domain?: DomainType | string;
  framework?: string;
  name?: string;
  nodes: LLDNode[];
  edges: Edge[];
};