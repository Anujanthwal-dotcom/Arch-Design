import React, { useState, useEffect } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { FunctionNodeData, Property, Parameter, Return } from '../../types';
import { generateId } from '../utils';
import { useCanvas } from '../context';
import { GripIcon, ChevronIcon } from '../icons';
import { AutoResizeTextarea } from '../components/AutoResizeTextarea';
import { CardFileBar, HeaderFileButton } from '../components/CardFileBar';

export const FunctionNode: React.FC<NodeProps> = ({ data, id, selected }) => {
  const nodeData = data as FunctionNodeData;
  const { updateNodeData, deleteNode } = useCanvas();
  const [properties, setProperties] = useState<Property[]>(nodeData.properties || []);
  const [parameters, setParameters] = useState<Parameter[]>(nodeData.parameters || []);
  const [returns, setReturns] = useState<Return[]>(nodeData.returns || []);
  const [isParamsExpanded, setIsParamsExpanded] = useState(true);
  const [isReturnsExpanded, setIsReturnsExpanded] = useState(true);
  const [isPropertiesExpanded, setIsPropertiesExpanded] = useState(false);
  const isCollapsed = Boolean(nodeData.isCollapsed);

  useEffect(() => {
    setProperties(nodeData.properties || []);
    setParameters(nodeData.parameters || []);
    setReturns(nodeData.returns || []);
  }, [nodeData.properties, nodeData.parameters, nodeData.returns]);

  const toggleCollapse = () => {
    updateNodeData(id, { isCollapsed: !isCollapsed });
  };

  const updateLabel = (label: string) => {
    updateNodeData(id, { label });
  };

  const updateDescription = (description: string) => {
    updateNodeData(id, { description });
  };

  const addProperty = () => {
    const newProp: Property = {
      id: generateId(),
      title: '',
      description: ''
    };
    const updated = [...properties, newProp];
    setProperties(updated);
    updateNodeData(id, { properties: updated });
  };

  const updateProperty = (propId: string, field: 'title' | 'description', value: string) => {
    const updated = properties.map(p => p.id === propId ? { ...p, [field]: value } : p);
    setProperties(updated);
    updateNodeData(id, { properties: updated });
  };

  const deleteProperty = (propId: string) => {
    const updated = properties.filter(p => p.id !== propId);
    setProperties(updated);
    updateNodeData(id, { properties: updated });
  };

  const addParameter = () => {
    const newParam: Parameter = {
      id: generateId(),
      name: '',
      type: '',
      required: true,
      description: ''
    };
    const updated = [...parameters, newParam];
    setParameters(updated);
    updateNodeData(id, { parameters: updated });
  };

  const updateParameter = (paramId: string, field: keyof Parameter, value: any) => {
    const updated = parameters.map(p => p.id === paramId ? { ...p, [field]: value } : p);
    setParameters(updated);
    updateNodeData(id, { parameters: updated });
  };

  const deleteParameter = (paramId: string) => {
    const updated = parameters.filter(p => p.id !== paramId);
    setParameters(updated);
    updateNodeData(id, { parameters: updated });
  };

  const addReturn = () => {
    const newRet: Return = {
      id: generateId(),
      name: '',
      type: '',
      required: true,
      description: ''
    };
    const updated = [...returns, newRet];
    setReturns(updated);
    updateNodeData(id, { returns: updated });
  };

  const updateReturn = (retId: string, field: keyof Return, value: any) => {
    const updated = returns.map(r => r.id === retId ? { ...r, [field]: value } : r);
    setReturns(updated);
    updateNodeData(id, { returns: updated });
  };

  const deleteReturn = (retId: string) => {
    const updated = returns.filter(r => r.id !== retId);
    setReturns(updated);
    updateNodeData(id, { returns: updated });
  };

  return (
    <div className={`lld-node function ${selected ? 'selected' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="card-bottom-handle nodrag"
        title="Drag to connect"
      />
      <div className="node-header">
        <div className="node-header-left">
          <span className="node-grip-handle" title="Drag card">
            <GripIcon size={12} />
          </span>
          <span className="node-type-badge function">Function</span>
          <span className="node-label">
            <input
              className="node-label-input nodrag"
              defaultValue={nodeData.label}
              key={nodeData.label}
              onBlur={(e) => updateLabel(e.target.value)}
              placeholder="Function name"
            />
          </span>
        </div>
        <div className="node-header-actions">
          <HeaderFileButton filePath={nodeData.filePath} />
          <button
            className="node-header-btn nodrag"
            onClick={toggleCollapse}
            title={isCollapsed ? 'Expand card' : 'Collapse card'}
            type="button"
          >
            <ChevronIcon expanded={!isCollapsed} size={13} />
          </button>
          <button
            className="node-close-btn nodrag"
            onClick={() => deleteNode(id)}
            title="Delete card"
          >
            ×
          </button>
        </div>
      </div>
      {!isCollapsed && (
        <div className="node-content nodrag">
        <div className="node-description">
          <AutoResizeTextarea
            className="node-description-input"
            defaultValue={nodeData.description || ''}
            key={nodeData.description}
            onBlur={(e) => updateDescription(e.target.value)}
            placeholder="Description..."
          />
        </div>

        <CardFileBar
          nodeId={id}
          filePath={nodeData.filePath}
          placeholder="Function file (e.g. src/utils/auth.ts)..."
        />
        
        <div className="section">
          <div className="section-header">
            <button
              className="section-title-btn nodrag"
              onClick={() => setIsParamsExpanded(!isParamsExpanded)}
              type="button"
              title={isParamsExpanded ? 'Collapse Parameters' : 'Expand Parameters'}
            >
              <span className="section-chevron">{isParamsExpanded ? '▾' : '▸'}</span>
              <span className="section-title">Parameters</span>
              {parameters.length > 0 && (
                <span className="section-count">{parameters.length}</span>
              )}
            </button>
            <button
              className="add-btn nodrag"
              onClick={addParameter}
              title="Add Parameter"
              type="button"
            >
              + Add
            </button>
          </div>
          {isParamsExpanded && (
            <>
              {parameters.map((param) => (
                <div key={param.id} className="param-item">
                  <button
                    className="delete-btn"
                    onClick={() => deleteParameter(param.id)}
                    title="Delete"
                    type="button"
                  >
                    ×
                  </button>
                  <div className="param-row">
                    <input
                      className="param-input name"
                      defaultValue={param.name}
                      onBlur={(e) => updateParameter(param.id, 'name', e.target.value)}
                      placeholder="Name"
                    />
                    <input
                      className="param-input type"
                      defaultValue={param.type}
                      onBlur={(e) => updateParameter(param.id, 'type', e.target.value)}
                      placeholder="Type"
                    />
                  </div>
                  <AutoResizeTextarea
                    className="param-desc-input"
                    defaultValue={param.description}
                    onBlur={(e) => updateParameter(param.id, 'description', e.target.value)}
                    placeholder="Description"
                  />
                </div>
              ))}
            </>
          )}
        </div>

        <div className="section">
          <div className="section-header">
            <button
              className="section-title-btn nodrag"
              onClick={() => setIsReturnsExpanded(!isReturnsExpanded)}
              type="button"
              title={isReturnsExpanded ? 'Collapse Returns' : 'Expand Returns'}
            >
              <span className="section-chevron">{isReturnsExpanded ? '▾' : '▸'}</span>
              <span className="section-title">Returns</span>
              {returns.length > 0 && (
                <span className="section-count">{returns.length}</span>
              )}
            </button>
            <button
              className="add-btn nodrag"
              onClick={addReturn}
              title="Add Return"
              type="button"
            >
              + Add
            </button>
          </div>
          {isReturnsExpanded && (
            <>
              {returns.map((ret) => (
                <div key={ret.id} className="param-item">
                  <button
                    className="delete-btn"
                    onClick={() => deleteReturn(ret.id)}
                    title="Delete"
                    type="button"
                  >
                    ×
                  </button>
                  <div className="param-row">
                    <input
                      className="param-input name"
                      defaultValue={ret.name}
                      onBlur={(e) => updateReturn(ret.id, 'name', e.target.value)}
                      placeholder="Name"
                    />
                    <input
                      className="param-input type"
                      defaultValue={ret.type}
                      onBlur={(e) => updateReturn(ret.id, 'type', e.target.value)}
                      placeholder="Type"
                    />
                  </div>
                  <AutoResizeTextarea
                    className="param-desc-input"
                    defaultValue={ret.description}
                    onBlur={(e) => updateReturn(ret.id, 'description', e.target.value)}
                    placeholder="Description"
                  />
                </div>
              ))}
            </>
          )}
        </div>

        <div className="section">
          <div className="section-header">
            <button
              className="section-title-btn nodrag"
              onClick={() => setIsPropertiesExpanded(!isPropertiesExpanded)}
              type="button"
              title={isPropertiesExpanded ? 'Collapse Properties' : 'Expand Properties'}
            >
              <span className="section-chevron">{isPropertiesExpanded ? '▾' : '▸'}</span>
              <span className="section-title">Properties</span>
              {properties.length > 0 && (
                <span className="section-count">{properties.length}</span>
              )}
            </button>
            <button
              className="add-btn nodrag"
              onClick={addProperty}
              title="Add Property"
              type="button"
            >
              + Add
            </button>
          </div>
          {isPropertiesExpanded && (
            <>
              {properties.map((prop) => (
                <div key={prop.id} className="property-item">
                  <button
                    className="delete-btn"
                    onClick={() => deleteProperty(prop.id)}
                    title="Delete"
                    type="button"
                  >
                    ×
                  </button>
                  <input
                    className="prop-title-input"
                    defaultValue={prop.title}
                    onBlur={(e) => updateProperty(prop.id, 'title', e.target.value)}
                    placeholder="Property title"
                  />
                  <AutoResizeTextarea
                    className="prop-desc-input"
                    defaultValue={prop.description}
                    onBlur={(e) => updateProperty(prop.id, 'description', e.target.value)}
                    placeholder="Property description"
                  />
                </div>
              ))}
            </>
          )}
        </div>
      </div>
      )}
    </div>
  );
};