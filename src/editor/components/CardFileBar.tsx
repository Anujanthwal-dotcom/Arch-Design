import React, { useState } from 'react';
import { useCanvas } from '../context';
import { FileCodeIcon, JumpToFileIcon } from '../icons';

export type CardFileBarProps = {
  nodeId: string;
  filePath?: string;
  placeholder?: string;
};

export const CardFileBar: React.FC<CardFileBarProps> = ({
  nodeId,
  filePath,
  placeholder = 'Attach source file (e.g. src/auth.ts)...',
}) => {
  const { updateNodeData, openFile } = useCanvas();
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(filePath || '');

  const hasFile = Boolean(filePath && filePath.trim());

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasFile && openFile) {
      openFile(filePath!.trim());
    }
  };

  const handleSave = () => {
    const trimmed = inputValue.trim();
    updateNodeData(nodeId, { filePath: trimmed });
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setInputValue(filePath || '');
      setIsEditing(false);
    }
  };

  if (!isEditing && hasFile) {
    const cleanPath = filePath!.trim();
    // Extract base name for clean display
    const segments = cleanPath.split(/[/\\]/);
    const fileName = segments[segments.length - 1] || cleanPath;

    return (
      <div className="card-file-bar nodrag">
        <div
          className="card-file-chip"
          onClick={handleOpen}
          title={`Click to open ${cleanPath} in editor (Beside)`}
        >
          <span className="card-file-chip-icon">
            <FileCodeIcon size={12} />
          </span>
          <span className="card-file-chip-path" title={cleanPath}>
            <span className="card-file-chip-name">{fileName}</span>
            {segments.length > 1 && (
              <span className="card-file-chip-dir"> ({cleanPath})</span>
            )}
          </span>
          <button
            className="card-file-jump-btn"
            onClick={handleOpen}
            title={`Open ${cleanPath} in split editor`}
            type="button"
          >
            <JumpToFileIcon size={11} />
            <span className="card-file-jump-text">Open</span>
          </button>
        </div>
        <button
          className="card-file-edit-btn"
          onClick={(e) => {
            e.stopPropagation();
            setInputValue(filePath || '');
            setIsEditing(true);
          }}
          title="Edit file path"
          type="button"
        >
          ✎
        </button>
      </div>
    );
  }

  return (
    <div className="card-file-bar-input-wrapper nodrag">
      <span className="card-file-input-icon">
        <FileCodeIcon size={12} />
      </span>
      <input
        className="card-file-input"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus={isEditing}
      />
      {inputValue && (
        <button
          className="card-file-clear-btn"
          onClick={() => {
            setInputValue('');
            updateNodeData(nodeId, { filePath: '' });
            setIsEditing(false);
          }}
          title="Clear file path"
          type="button"
        >
          ×
        </button>
      )}
    </div>
  );
};

export const HeaderFileButton: React.FC<{ filePath?: string }> = ({ filePath }) => {
  const { openFile } = useCanvas();
  if (!filePath || !filePath.trim()) return null;

  const cleanPath = filePath.trim();

  return (
    <button
      className="node-header-file-btn nodrag"
      onClick={(e) => {
        e.stopPropagation();
        if (openFile) openFile(cleanPath);
      }}
      title={`Open ${cleanPath} in editor`}
      type="button"
    >
      <JumpToFileIcon size={12} />
    </button>
  );
};
