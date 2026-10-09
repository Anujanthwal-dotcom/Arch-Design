import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Connection,
  Node,
  Edge,
  ConnectionMode,
  ConnectionLineType,
  MarkerType,
} from '@xyflow/react';

import { ModuleNode } from './nodes/ModuleNode';
import { ServiceNode } from './nodes/ServiceNode';
import { ComponentNode } from './nodes/ComponentNode';
import { TypeNode } from './nodes/TypeNode';
import { FunctionNode } from './nodes/FunctionNode';
import { ExternalNode } from './nodes/ExternalNode';
import { ArchetypeNode } from './nodes/ArchetypeNode';
import { DomainSelector, FrameworkSelector } from './components/DomainSelector';
import { resolvePreset } from './presets';
import { FloatingEdge } from './edges/FloatingEdge';
import { checkValidConnection, generateId, resolveEdgeType } from './utils';
import { applyDagreLayout, resolveCollisionOnDrag } from './dagreLayout';
import { LLDDocument, LLDNode, Edge as LLDFileEdge, DomainType, ArchitectureTier, resolveNodeTier } from '../types';
import { vscode } from './vscodeApi';
import { CanvasContext } from './context';

const baseNodeTypes: Record<string, React.ComponentType<any>> = {
  module: ModuleNode,
  service: ServiceNode,
  component: ComponentNode,
  type: TypeNode,
  function: FunctionNode,
  external: ExternalNode,
  archetype: ArchetypeNode,
};

const nodeTypes = new Proxy(baseNodeTypes, {
  get(target, prop: string) {
    if (prop in target) {
      return target[prop];
    }
    return ArchetypeNode;
  },
});

const edgeTypes = {
  floating: FloatingEdge,
  step: FloatingEdge,
  default: FloatingEdge,
};

const defaultMarker = {
  type: MarkerType.ArrowClosed,
  width: 12,
  height: 12,
  color: '#969696',
};

export const AppContent: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [fileName, setFileName] = useState('architecture');
  const [framework, setFramework] = useState<string>('universal');
  const activePreset = useMemo(() => resolvePreset(framework), [framework]);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customTier, setCustomTier] = useState<ArchitectureTier>('logic');
  const [isLoading, setIsLoading] = useState(true);
  const [focusModeEnabled, setFocusModeEnabled] = useState(true);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [hoveredEdgeId, setHoveredEdgeId] = useState<string | null>(null);
  const isUpdatingFromDocument = useRef(false);
  const isInitialized = useRef(false);
  const documentText = useRef('');
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const nodesRef = useRef<Node[]>(nodes);
  nodesRef.current = nodes;

  const stripRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = stripRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 2);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2);
  }, []);

  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => updateScrollState());
      ro.observe(el);
    }
    window.addEventListener('resize', updateScrollState);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      if (ro) ro.disconnect();
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState, activePreset]);

  const scrollStrip = (direction: 'left' | 'right') => {
    if (stripRef.current) {
      const amount = direction === 'left' ? -150 : 150;
      stripRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const { fitView } = useReactFlow();

  const selectedNode = useMemo(() => nodes.find((n) => n.selected), [nodes]);
  const selectedEdge = useMemo(() => edges.find((e) => e.selected), [edges]);

  const activeNodeId = hoveredNodeId || selectedNode?.id || null;
  const activeEdgeId = (!hoveredNodeId && (hoveredEdgeId || selectedEdge?.id)) || null;

  const isFocusActive = focusModeEnabled && (activeNodeId !== null || activeEdgeId !== null);

  const { focusedNodeIds, focusedEdgeIds, incomingEdgeIds, outgoingEdgeIds } = useMemo(() => {
    const nodeIds = new Set<string>();
    const edgeIds = new Set<string>();
    const incoming = new Set<string>();
    const outgoing = new Set<string>();

    if (!isFocusActive) {
      return { focusedNodeIds: nodeIds, focusedEdgeIds: edgeIds, incomingEdgeIds: incoming, outgoingEdgeIds: outgoing };
    }

    if (activeNodeId) {
      nodeIds.add(activeNodeId);
      edges.forEach((edge) => {
        if (edge.source === activeNodeId) {
          edgeIds.add(edge.id);
          outgoing.add(edge.id);
          nodeIds.add(edge.target);
        } else if (edge.target === activeNodeId) {
          edgeIds.add(edge.id);
          incoming.add(edge.id);
          nodeIds.add(edge.source);
        }
      });
    } else if (activeEdgeId) {
      const edge = edges.find((e) => e.id === activeEdgeId);
      if (edge) {
        edgeIds.add(edge.id);
        nodeIds.add(edge.source);
        nodeIds.add(edge.target);
      }
    }

    return { focusedNodeIds: nodeIds, focusedEdgeIds: edgeIds, incomingEdgeIds: incoming, outgoingEdgeIds: outgoing };
  }, [isFocusActive, activeNodeId, activeEdgeId, edges]);

  const displayNodes = useMemo(() => {
    if (!isFocusActive) {
      return nodes;
    }

    return nodes.map((node) => {
      const isPrimary = node.id === activeNodeId;
      const isFocused = focusedNodeIds.has(node.id);

      let focusClass = 'dimmed';
      if (isPrimary) {
        focusClass = 'node-focused primary';
      } else if (isFocused) {
        focusClass = 'node-focused connected';
      }

      return {
        ...node,
        className: `${node.className || ''} ${focusClass}`.trim(),
      };
    });
  }, [nodes, isFocusActive, activeNodeId, focusedNodeIds]);

  const displayEdges = useMemo(() => {
    if (!isFocusActive) {
      return edges;
    }

    return edges.map((edge) => {
      const isFocused = focusedEdgeIds.has(edge.id);
      const isIncoming = incomingEdgeIds.has(edge.id);
      const isOutgoing = outgoingEdgeIds.has(edge.id);

      let edgeClass = 'dimmed';
      let strokeColor = '#969696';

      if (isFocused) {
        if (isOutgoing) {
          edgeClass = 'edge-focused outgoing';
          strokeColor = '#38bdf8';
        } else if (isIncoming) {
          edgeClass = 'edge-focused incoming';
          strokeColor = '#4ade80';
        } else {
          edgeClass = 'edge-focused';
          strokeColor = '#38bdf8';
        }
      }

      return {
        ...edge,
        className: `${edge.className || ''} ${edgeClass}`.trim(),
        animated: isFocused,
        zIndex: isFocused ? 1000 : 0,
        style: {
          ...edge.style,
          stroke: isFocused ? strokeColor : (edge.style?.stroke || '#969696'),
          strokeWidth: isFocused ? 2.5 : 1.5,
          opacity: isFocused ? 1 : 0.12,
        },
        markerEnd: isFocused
          ? {
              ...defaultMarker,
              color: strokeColor,
            }
          : {
              ...defaultMarker,
              color: '#555555',
            },
      };
    });
  }, [edges, isFocusActive, focusedEdgeIds, incomingEdgeIds, outgoingEdgeIds]);

  const handleNodeMouseEnter = useCallback((_event: React.MouseEvent, node: Node) => {
    setHoveredNodeId(node.id);
  }, []);

  const handleNodeMouseLeave = useCallback(() => {
    setHoveredNodeId(null);
  }, []);

  const handleEdgeMouseEnter = useCallback((_event: React.MouseEvent, edge: Edge) => {
    setHoveredEdgeId(edge.id);
  }, []);

  const handleEdgeMouseLeave = useCallback(() => {
    setHoveredEdgeId(null);
  }, []);

  const handlePaneClick = useCallback(() => {
    setHoveredNodeId(null);
    setHoveredEdgeId(null);
  }, []);

  const handleAutoLayout = useCallback(
    (direction: 'LR' | 'TB' = 'LR') => {
      const { nodes: layoutedNodes, edges: layoutedEdges } = applyDagreLayout(
        nodes,
        edges,
        direction
      );
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
      setTimeout(() => {
        fitView({ duration: 300, padding: 0.2 });
      }, 50);
    },
    [nodes, edges, setNodes, setEdges, fitView]
  );

  const onNodeDragStop = useCallback(
    (_event: MouseEvent | TouchEvent, node: Node) => {
      const { x, y } = resolveCollisionOnDrag(node, nodes);
      if (x !== node.position.x || y !== node.position.y) {
        setNodes((nds) =>
          nds.map((n) => (n.id === node.id ? { ...n, position: { x, y } } : n))
        );
      }
    },
    [nodes, setNodes]
  );

  const updateNodeData = useCallback(
    (nodeId: string, partialData: Record<string, any>) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                ...partialData,
              },
            };
          }
          return node;
        })
      );
    },
    [setNodes]
  );

  const deleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) =>
        eds.filter((e) => e.source !== nodeId && e.target !== nodeId)
      );
    },
    [setNodes, setEdges]
  );

  const openFile = useCallback((filePath: string) => {
    if (!filePath || !filePath.trim()) return;
    vscode.postMessage({
      type: 'openFile',
      filePath: filePath.trim(),
    });
  }, []);

  const validateConnection = useCallback(
    (connection: Connection | Edge) => {
      return checkValidConnection(connection, nodes, edges);
    },
    [nodes, edges]
  );

  const onConnect = useCallback(
    (params: Connection) => {
      if (!checkValidConnection(params, nodes, edges)) {
        return;
      }
      const sNode = nodes.find((n) => n.id === params.source);
      const tNode = nodes.find((n) => n.id === params.target);
      const sType = String(sNode?.data?.nodeType || sNode?.type || '');
      const tType = String(tNode?.data?.nodeType || tNode?.type || '');
      const edgeType = resolveEdgeType(sType, tType, sNode?.data?.tier, tNode?.data?.tier);

      const newEdge: Edge = {
        id: generateId(),
        source: params.source!,
        target: params.target!,
        type: 'floating',
        data: { edgeType },
        markerEnd: defaultMarker,
        style: {
          strokeDasharray: '5,5',
        },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [nodes, edges, setEdges]
  );

  const serializeDocument = useCallback((): string => {
    const lldNodes: LLDNode[] = nodes.map((node) => {
      const nodeData = node.data || {};
      const rawType = String(nodeData.nodeType || node.type || 'card');
      const tier = resolveNodeTier(rawType, nodeData.tier);
      const lldNode: LLDNode = {
        id: node.id,
        type: rawType,
        tier,
        label: String(nodeData.label || ''),
        pos: node.position,
      };

      if (nodeData.description) {
        lldNode.description = String(nodeData.description);
      }
      if (nodeData.subType) {
        lldNode.subType = String(nodeData.subType);
      }
      if (nodeData.properties && Array.isArray(nodeData.properties)) {
        lldNode.properties = nodeData.properties as any;
      }
      if (nodeData.typeRef) {
        lldNode.typeRef = String(nodeData.typeRef);
      }
      if (nodeData.filePath) {
        lldNode.filePath = String(nodeData.filePath);
      }
      if (nodeData.parameters && Array.isArray(nodeData.parameters)) {
        lldNode.parameters = nodeData.parameters as any;
      }
      if (nodeData.returns && Array.isArray(nodeData.returns)) {
        lldNode.returns = nodeData.returns as any;
      }
      if (nodeData.tech) {
        lldNode.tech = String(nodeData.tech);
      }
      if (nodeData.isCollapsed !== undefined) {
        lldNode.isCollapsed = Boolean(nodeData.isCollapsed);
      }

      return lldNode;
    });

    const nodeTypeMap = new Map(
      nodes.map((n) => [n.id, (n.data?.nodeType || n.type) as string])
    );

    const lldEdges: LLDFileEdge[] = edges.map((edge) => {
      let edgeType = (edge.data as any)?.edgeType || edge.label?.toString();
      if (!edgeType) {
        const sType = nodeTypeMap.get(edge.source) || '';
        const tType = nodeTypeMap.get(edge.target) || '';
        edgeType = resolveEdgeType(sType, tType);
      }
      return {
        id: edge.id,
        from: edge.source,
        to: edge.target,
        type: edgeType,
      };
    });

    const doc: LLDDocument = {
      version: 2,
      domain: (activePreset.category === 'universal' ? 'universal' : activePreset.category) as DomainType,
      framework: activePreset.id,
      name: fileName,
      nodes: lldNodes,
      edges: lldEdges,
    };

    return JSON.stringify(doc, null, 2);
  }, [nodes, edges, fileName, activePreset]);

  const addNode = useCallback(
    (
      type: string,
      defaultSubType?: string,
      explicitTier?: ArchitectureTier,
      customLabel?: string,
      defaultTech?: string
    ) => {
      const id = generateId();
      const tier = resolveNodeTier(type, explicitTier);
      let position = {
        x: 100 + Math.floor(Math.random() * 200),
        y: 100 + Math.floor(Math.random() * 200),
      };

      if (nodes.length > 0) {
        const tierColumns: Record<ArchitectureTier, number> = {
          container: 100,
          presentation: 100,
          logic: 480,
          contract: 480,
          execution: 860,
          infrastructure: 860,
        };
        const colX = tierColumns[tier] || 100;
        const nodesInCol = nodes.filter((n) => Math.abs(n.position.x - colX) < 180);
        if (nodesInCol.length > 0) {
          const maxY = Math.max(...nodesInCol.map((n) => n.position.y));
          position = { x: colX, y: maxY + 240 };
        } else {
          position = { x: colX, y: 100 };
        }
      }

      const defaultLabel = customLabel || `New ${type.charAt(0).toUpperCase() + type.slice(1)}`;

      const newNode: Node = {
        id,
        type,
        position,
        data: {
          nodeType: type,
          tier,
          label: defaultLabel,
          description: '',
          properties: [],
          isCollapsed: true,
          ...(defaultSubType && { subType: defaultSubType }),
          ...((defaultTech || tier === 'infrastructure') && { tech: defaultTech || defaultSubType || 'postgres' }),
        },
      };
      setNodes((nds) => [...nds, newNode]);
    },
    [nodes, setNodes]
  );

  useEffect(() => {
    vscode.postMessage({ type: 'ready' });
  }, []);

  useEffect(() => {
    const messageHandler = (event: MessageEvent) => {
      const message = event.data;
      if (message.type === 'update') {
        const text = message.text;
        if (text !== documentText.current) {
          documentText.current = text;
          try {
            if (text.trim() === '') {
              isUpdatingFromDocument.current = true;
              setNodes([]);
              setEdges([]);
              isInitialized.current = true;
              setIsLoading(false);
              setTimeout(() => {
                isUpdatingFromDocument.current = false;
              }, 50);
              return;
            }
            const doc: LLDDocument = JSON.parse(text);
            const wasInitial = !isInitialized.current;
            const reactNodes: Node[] = (doc.nodes || []).map((node) => {
              const existingNode = nodesRef.current.find((n) => n.id === node.id);
              const isCollapsed = wasInitial
                ? true
                : existingNode
                ? Boolean(existingNode.data?.isCollapsed)
                : (node.isCollapsed !== undefined ? Boolean(node.isCollapsed) : true);

              return {
                id: node.id,
                type: node.type,
                position: node.pos || { x: 100, y: 100 },
                data: {
                  nodeType: node.type,
                  label: node.label || '',
                  description: node.description || '',
                  properties: node.properties || [],
                  subType: node.subType,
                  typeRef: node.typeRef,
                  filePath: node.filePath || node.typeRef,
                  parameters: node.parameters || [],
                  returns: node.returns || [],
                  tech: node.tech,
                  isCollapsed,
                },
              };
            });
            const reactEdges: Edge[] = (doc.edges || []).map((edge) => ({
              id: edge.id,
              source: edge.from,
              target: edge.to,
              type: 'floating',
              data: {
                edgeType: edge.type,
              },
              markerEnd: defaultMarker,
              style: {
                strokeDasharray: '5,5',
              },
            }));
            isUpdatingFromDocument.current = true;
            setNodes(reactNodes);
            setEdges(reactEdges);
            if (doc.framework) {
              setFramework(doc.framework);
            } else if (doc.domain) {
              setFramework(doc.domain);
            }
            isInitialized.current = true;
            setIsLoading(false);
            if (wasInitial && reactNodes.length > 0) {
              setTimeout(() => {
                fitView({ duration: 300, padding: 0.2 });
              }, 80);
            }
            setTimeout(() => {
              isUpdatingFromDocument.current = false;
            }, 50);
          } catch (e) {
            console.error('Failed to parse document:', e);
            setIsLoading(false);
          }
        }
      }
    };

    window.addEventListener('message', messageHandler);
    return () => window.removeEventListener('message', messageHandler);
  }, [setNodes, setEdges]);

  // Debounced auto-save on changes
  useEffect(() => {
    if (!isInitialized.current || isUpdatingFromDocument.current) {
      return;
    }

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      const newText = serializeDocument();
      if (newText !== documentText.current) {
        documentText.current = newText;
        vscode.postMessage({
          type: 'update',
          text: newText,
        });
      }
    }, 250);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [nodes, edges, serializeDocument]);

  const handleAddCustomCard = () => {
    if (!customName.trim()) return;
    addNode(customName.trim().toLowerCase(), undefined, customTier, customName.trim());
    setCustomName('');
    setIsCustomModalOpen(false);
  };

  return (
    <CanvasContext.Provider value={{ updateNodeData, deleteNode, openFile }}>
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        <div className="toolbar">
          <FrameworkSelector value={framework} onChange={setFramework} />
          <div className="toolbar-separator" />
          <button
            className="toolbar-btn"
            onClick={() => handleAutoLayout('LR')}
            title="Auto-arrange cards and resolve collisions using Dagre"
          >
            Auto Layout
          </button>
          <button
            className={`toolbar-btn ${focusModeEnabled ? 'active' : ''}`}
            onClick={() => setFocusModeEnabled((prev) => !prev)}
            title={
              focusModeEnabled
                ? 'Focus Mode: ON (Hover or select cards to highlight connected paths and dim clutter). Click to turn OFF.'
                : 'Focus Mode: OFF (Click to turn ON).'
            }
          >
            Focus Mode: {focusModeEnabled ? 'ON' : 'OFF'}
          </button>
          <div className="toolbar-separator" />
          {canScrollLeft && (
            <button
              type="button"
              className="toolbar-nav-arrow left"
              onClick={() => scrollStrip('left')}
              title="Scroll left"
              aria-label="Scroll left"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 11, height: 11 }}>
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          )}
          <div
            ref={stripRef}
            className="toolbar-actions-strip"
            onWheel={(e) => {
              if (e.deltaY !== 0) {
                e.currentTarget.scrollLeft += e.deltaY;
              }
            }}
          >
            {activePreset.archetypes.map((arch) => (
              <button
                key={`${arch.type}-${arch.subType || ''}-${arch.label}`}
                className="toolbar-btn"
                onClick={() => addNode(arch.type, arch.subType, arch.tier, arch.label, arch.tech)}
                title={`Add ${arch.label} (${arch.tier} tier)`}
              >
                + {arch.label}
              </button>
            ))}
            <div className="toolbar-separator" />
            <button
              className="toolbar-btn"
              onClick={() => setIsCustomModalOpen(true)}
              title="Create a custom card archetype for any domain or framework"
            >
              + Custom Card...
            </button>
          </div>
          {canScrollRight && (
            <button
              type="button"
              className="toolbar-nav-arrow right"
              onClick={() => scrollStrip('right')}
              title="Scroll right"
              aria-label="Scroll right"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 11, height: 11 }}>
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}
        </div>

        {isLoading && (
          <div className="canvas-loading-overlay">
            <div className="canvas-loading-spinner" />
            <div className="canvas-loading-text">Loading architecture canvas...</div>
          </div>
        )}

        {!isLoading && nodes.length === 0 && (
          <div className="empty-canvas-hint">
            <strong>Blank Architecture Canvas ({activePreset.name})</strong>
            <p style={{ margin: '6px 0 0 0', fontSize: '12px' }}>
              Select a framework preset above or click cards to start designing your architecture.
            </p>
          </div>
        )}

        <ReactFlow
          nodes={displayNodes}
          edges={displayEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeDragStop={onNodeDragStop}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          connectionMode={ConnectionMode.Loose}
          connectionRadius={40}
          connectionLineType={ConnectionLineType.SmoothStep}
          connectionLineStyle={{ stroke: '#969696', strokeWidth: 2, strokeDasharray: '5,5' }}
          defaultEdgeOptions={{
            type: 'floating',
            markerEnd: defaultMarker,
            style: {
              strokeDasharray: '5,5',
              strokeWidth: 2,
              stroke: '#969696',
            },
          }}
          isValidConnection={validateConnection}
          onNodeMouseEnter={handleNodeMouseEnter}
          onNodeMouseLeave={handleNodeMouseLeave}
          onEdgeMouseEnter={handleEdgeMouseEnter}
          onEdgeMouseLeave={handleEdgeMouseLeave}
          onPaneClick={handlePaneClick}
          fitView
          minZoom={0.1}
          maxZoom={1.5}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#2a2a30" gap={16} />
          <Controls />
        </ReactFlow>

        <div className="canvas-bottom-right-panel">
          {isFocusActive ? (
            <div className="focus-badge active" title="Active Focus Context">
              <span className="focus-badge-title">
                {activeNodeId
                  ? String(nodes.find((n) => n.id === activeNodeId)?.data?.label || 'Card')
                  : 'Connection'}
              </span>
              {activeNodeId && (
                <span className="focus-badge-counts">
                  <span className="focus-incoming-dot" title="Incoming injections">
                    ● {incomingEdgeIds.size} in
                  </span>
                  <span className="focus-outgoing-dot" title="Outgoing injections">
                    ● {outgoingEdgeIds.size} out
                  </span>
                </span>
              )}
            </div>
          ) : (
            <div className="focus-badge idle" title="Canvas Summary">
              <span className="focus-badge-title" style={{ color: 'var(--text-secondary)' }}>
                {nodes.length} cards • {edges.length} connections
              </span>
            </div>
          )}
        </div>

        {isCustomModalOpen && (
          <div className="custom-card-backdrop" onClick={() => setIsCustomModalOpen(false)}>
            <div className="custom-card-modal" onClick={(e) => e.stopPropagation()}>
              <h3 className="custom-card-title">Add Custom Card Archetype</h3>
              <input
                className="custom-card-input"
                type="text"
                placeholder="Card Name (e.g. BLoC, Actor, Flow)"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddCustomCard();
                  if (e.key === 'Escape') setIsCustomModalOpen(false);
                }}
                autoFocus
              />
              <div>
                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Architectural Tier
                </label>
                <select
                  className="toolbar-select"
                  style={{ width: '100%' }}
                  value={customTier}
                  onChange={(e) => setCustomTier(e.target.value as ArchitectureTier)}
                >
                  <option value="container">Container (Module, Crate, Package)</option>
                  <option value="presentation">Presentation (UI, Screen, View)</option>
                  <option value="logic">Logic (Service, ViewModel, Store, UseCase)</option>
                  <option value="contract">Contract (Type, Struct, Trait, Schema, Entity)</option>
                  <option value="execution">Execution (Function, Action, Routine)</option>
                  <option value="infrastructure">Infrastructure (Database, External, Driver)</option>
                </select>
              </div>
              <div className="custom-card-actions">
                <button className="toolbar-btn" onClick={() => setIsCustomModalOpen(false)}>
                  Cancel
                </button>
                <button
                  className="toolbar-btn active"
                  onClick={handleAddCustomCard}
                  disabled={!customName.trim()}
                >
                  Create Card
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </CanvasContext.Provider>
  );
};

export const App: React.FC = () => {
  return (
    <ReactFlowProvider>
      <AppContent />
    </ReactFlowProvider>
  );
};