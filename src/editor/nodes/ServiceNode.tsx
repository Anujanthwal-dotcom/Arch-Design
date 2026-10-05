import React, { useState, useEffect } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { ServiceNodeData, Property } from '../../types';
import { generateId } from '../utils';
import { useCanvas } from '../context';
import { GripIcon, ChevronIcon } from '../icons';
import { AutoResizeTextarea } from '../components/AutoResizeTextarea';

export const ServiceNode: React.FC<NodeProps> = ({ data, id, selected }) => {
  const nodeData = data as ServiceNodeData;
  const { updateNodeData, deleteNode } = useCanvas();
  const [properties, setProperties] = useState<Property[]>(nodeData.properties || []);
  const [isPropertiesExpanded, setIsPropertiesExpanded] = useState(true);
  const isCollapsed = Boolean(nodeData.isCollapsed);

  useEffect(() => {
    setProperties(nodeData.properties || []);
  }, [nodeData.properties]);

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

  return (
    <div className={`lld-node service ${selected ? 'selected' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
      <Handle type="target" position={Position.Left} />
      <div className="node-header">
        <div className="node-header-left">
          <span className="node-grip-handle" title="Drag card">
            <GripIcon size={12} />
          </span>
          <span className="node-type-badge service">Service</span>
          <span className="node-label">
            <input
              className="node-label-input nodrag"
              defaultValue={nodeData.label}
              key={nodeData.label}
              onBlur={(e) => updateLabel(e.target.value)}
              placeholder="Service name"
            />
          </span>
        </div>
        <div className="node-header-actions">
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
      <Handle type="source" position={Position.Right} />
    </div>
  );
};