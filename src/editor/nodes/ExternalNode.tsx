import React, { useState, useEffect } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { ExternalNodeData, Property } from '../../types';
import { generateId } from '../utils';
import { TechIcon, GripIcon, ChevronIcon, getTechMeta, KNOWN_TECH_GROUPS } from '../icons';
import { useCanvas } from '../context';
import { AutoResizeTextarea } from '../components/AutoResizeTextarea';
import { CardFileBar, HeaderFileButton } from '../components/CardFileBar';

export const ExternalNode: React.FC<NodeProps> = ({ data, id, selected }) => {
  const nodeData = data as ExternalNodeData;
  const { updateNodeData, deleteNode } = useCanvas();
  const [properties, setProperties] = useState<Property[]>(nodeData.properties || []);
  const [isPropertiesExpanded, setIsPropertiesExpanded] = useState(true);
  const isCollapsed = Boolean(nodeData.isCollapsed);

  const techMeta = getTechMeta(nodeData.tech || '');
  const [isCustomTech, setIsCustomTech] = useState<boolean>(() => {
    if (!nodeData.tech) return false;
    return !techMeta.isKnown;
  });

  useEffect(() => {
    if (nodeData.tech && !getTechMeta(nodeData.tech).isKnown) {
      setIsCustomTech(true);
    } else {
      setIsCustomTech(false);
    }
  }, [nodeData.tech]);

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

  const updateTech = (tech: string) => {
    updateNodeData(id, { tech });
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

  const handleTechSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'other') {
      setIsCustomTech(true);
    } else {
      setIsCustomTech(false);
      updateTech(val);
      if (!nodeData.label || nodeData.label.toLowerCase().includes('external')) {
        const meta = getTechMeta(val);
        if (meta.isKnown) {
          updateLabel(meta.label);
        }
      }
    }
  };

  return (
    <div className={`lld-node external ${selected ? 'selected' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
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
          {techMeta.isKnown ? (
            <span
              className="node-type-badge external has-tech-logo"
              style={{
                borderColor: techMeta.brandColor ? `${techMeta.brandColor}55` : undefined,
                background: techMeta.brandColor ? `${techMeta.brandColor}18` : undefined,
                color: techMeta.brandColor || '#c586c0',
              }}
              title={`Infrastructure: ${techMeta.label}`}
            >
              <TechIcon tech={nodeData.tech || ''} size={12} colored />
              <span className="tech-badge-name">{techMeta.label}</span>
            </span>
          ) : (
            <span className="node-type-badge external">External</span>
          )}
          <span className="node-label">
            <input
              className="node-label-input nodrag"
              defaultValue={nodeData.label}
              key={nodeData.label}
              onBlur={(e) => updateLabel(e.target.value)}
              placeholder="External name"
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
          placeholder="Client / config file (e.g. src/db/client.ts)..."
        />

        <div className="field-group">
          <span className="field-label">Tech:</span>
          <div className="tech-selector-row">
            <div className="tech-select-wrapper">
              <TechIcon tech={nodeData.tech || ''} size={14} colored />
              <select
                className="field-select nodrag"
                value={isCustomTech ? 'other' : (techMeta.isKnown ? techMeta.id : (nodeData.tech || ''))}
                onChange={handleTechSelect}
              >
                <option value="">Select Technology...</option>
                {KNOWN_TECH_GROUPS.map((group) => (
                  <optgroup key={group.label} label={group.label}>
                    {group.options.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
                <option value="other">Other / Custom...</option>
              </select>
            </div>
            {isCustomTech && (
              <input
                className="field-input nodrag custom-tech-input"
                defaultValue={techMeta.isKnown ? '' : (nodeData.tech || '')}
                key={`custom-${nodeData.tech}`}
                onBlur={(e) => updateTech(e.target.value)}
                placeholder="Custom tech (e.g. Cassandra, DynamoDB)..."
              />
            )}
          </div>
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