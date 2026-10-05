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

export type NodeType = 'module' | 'service' | 'function' | 'external';

export type NodeDataBase = {
  label: string;
  description?: string;
  properties: Property[];
  [key: string]: any;
};

export type ModuleNodeData = NodeDataBase;

export type ServiceNodeData = NodeDataBase & {
  typeRef?: string;
};

export type FunctionNodeData = NodeDataBase & {
  parameters: Parameter[];
  returns: Return[];
};

export type ExternalNodeData = NodeDataBase & {
  tech?: string;
};

export type NodeData = ModuleNodeData | ServiceNodeData | FunctionNodeData | ExternalNodeData;

export type LLDNode = {
  id: string;
  type: NodeType;
  label: string;
  pos: Position;
  description?: string;
  properties?: Property[];
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

export type LLDDocument = {
  version: number;
  name?: string;
  nodes: LLDNode[];
  edges: Edge[];
};

export type LLDFile = {
  version: number;
  name?: string;
  nodes: LLDNode[];
  edges: Edge[];
};