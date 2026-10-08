import React, { useState, useEffect } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { ArchetypeNodeData, Property, resolveNodeTier } from '../../types';
import { generateId } from '../utils';
import { useCanvas } from '../context';
import { GripIcon, ChevronIcon } from '../icons';
import { AutoResizeTextarea } from '../components/AutoResizeTextarea';

export const ArchetypeNode: React.FC<NodeProps> = ({ data, id, selected }) => {
  const nodeData = data as ArchetypeNodeData;
  const { updateNodeData, deleteNode } = useCanvas();
  const [properties, setProperties] = useState<Property[]>(nodeData.properties || []);
  const [isPropertiesExpanded, setIsPropertiesExpanded] = useState(true);
  const isCollapsed = Boolean(nodeData.isCollapsed);

  const rawType = String(nodeData.nodeType || 'card');
  const tier = resolveNodeTier(rawType, nodeData.tier);

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

  const updateSubType = (subType: string) => {
    updateNodeData(id, { subType });
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

  const getSectionTitle = () => {
    switch (tier) {
      case 'presentation': return 'Props & UI State';
      case 'logic': return 'State & Actions';
      case 'contract': return 'Fields & Signatures';
      case 'execution': return 'Parameters & Return';
      case 'infrastructure': return 'Config & Connection';
      default: return 'Properties';
    }
  };

  const badgeTitle = rawType.charAt(0).toUpperCase() + rawType.slice(1);

  return (
    <div className={`lld-node tier-${tier} archetype-${rawType.toLowerCase()} ${selected ? 'selected' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="card-receiver-handle"
      />
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
          <span className={`node-type-badge tier-${tier}`}>
            {badgeTitle}
          </span>
          <span className="node-label">
            <input
              className="node-label-input nodrag"
              defaultValue={nodeData.label}
              key={nodeData.label}
              onBlur={(e) => updateLabel(e.target.value)}
              placeholder={`${badgeTitle} name`}
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
              placeholder={`${badgeTitle} responsibility or role...`}
            />
          </div>

          <div className="field-group">
            <span className="field-label">Role / Subtype:</span>
            <input
              className="field-input nodrag"
              defaultValue={nodeData.subType || ''}
              key={nodeData.subType}
              onBlur={(e) => updateSubType(e.target.value)}
              placeholder="e.g. composable, flow, zustand, sqlite, trait..."
            />
          </div>

          <div className="section">
            <div className="section-header">
              <button
                className="section-title-btn nodrag"
                onClick={() => setIsPropertiesExpanded(!isPropertiesExpanded)}
                type="button"
                title={isPropertiesExpanded ? `Collapse ${getSectionTitle()}` : `Expand ${getSectionTitle()}`}
              >
                <span className="section-chevron">{isPropertiesExpanded ? '▾' : '▸'}</span>
                <span className="section-title">{getSectionTitle()}</span>
                {properties.length > 0 && (
                  <span className="section-count">{properties.length}</span>
                )}
              </button>
              <button
                className="add-btn nodrag"
                onClick={addProperty}
                title="Add Item"
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
                      placeholder="Title / Key"
                    />
                    <AutoResizeTextarea
                      className="prop-desc-input"
                      defaultValue={prop.description}
                      onBlur={(e) => updateProperty(prop.id, 'description', e.target.value)}
                      placeholder="Type, contract, or detail"
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
