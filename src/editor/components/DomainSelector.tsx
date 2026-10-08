import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  FRAMEWORK_PRESETS,
  FrameworkPreset,
  DomainCategory,
  resolvePreset,
} from '../presets';

export type DomainOption = FrameworkPreset;

export interface DomainSelectorProps {
  value: string;
  onChange: (presetId: string) => void;
}

type DomainKey = Exclude<DomainCategory, 'all'>;

interface DomainGroup {
  key: DomainKey;
  label: string;
  shortLabel: string;
  icon: (color: string) => React.ReactNode;
}

const DOMAIN_GROUPS: DomainGroup[] = [
  {
    key: 'frontend',
    label: 'Web & Frontend',
    shortLabel: 'Web',
    icon: (c) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    key: 'backend',
    label: 'Backend & APIs',
    shortLabel: 'Backend',
    icon: (c) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
        <rect x="2" y="2" width="20" height="8" rx="2" />
        <rect x="2" y="14" width="20" height="8" rx="2" />
        <line x1="6" y1="6" x2="6.01" y2="6" />
        <line x1="6" y1="18" x2="6.01" y2="18" />
      </svg>
    ),
  },
  {
    key: 'mobile',
    label: 'Mobile Apps',
    shortLabel: 'Mobile',
    icon: (c) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
        <rect x="5" y="2" width="14" height="20" rx="3" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
  },
  {
    key: 'systems',
    label: 'Systems & Runtime',
    shortLabel: 'Systems',
    icon: (c) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" y1="19" x2="20" y2="19" />
      </svg>
    ),
  },
  {
    key: 'universal',
    label: 'Architecture Patterns',
    shortLabel: 'Patterns',
    icon: (c) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
];

export const DomainSelector: React.FC<DomainSelectorProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<DomainKey>('frontend');
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const currentPreset = useMemo(() => resolvePreset(value), [value]);

  const currentDomainGroup = useMemo(() => {
    return DOMAIN_GROUPS.find((g) => g.key === currentPreset.category) || DOMAIN_GROUPS[0];
  }, [currentPreset]);

  // Sync hovered category with current preset whenever menu opens
  useEffect(() => {
    if (isOpen) {
      setHoveredCategory(currentPreset.category as DomainKey);
      setSearchQuery('');
    }
  }, [isOpen, currentPreset]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const frameworksForActiveDomain = useMemo(() => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return FRAMEWORK_PRESETS.filter((p) => {
        return (
          p.name.toLowerCase().includes(q) ||
          p.shortName.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.archetypes.some((a) => a.label.toLowerCase().includes(q))
        );
      });
    }
    return FRAMEWORK_PRESETS.filter((p) => p.category === hoveredCategory);
  }, [hoveredCategory, searchQuery]);

  const handleSelectFramework = (id: string) => {
    onChange(id);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'Enter' || e.key === ' ') {
      if (!isOpen) {
        e.preventDefault();
        setIsOpen(true);
      }
    }
  };

  return (
    <div className="domain-selector framework-selector" ref={containerRef}>
      <button
        type="button"
        className={`domain-trigger ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        title="Select Architecture Framework"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="domain-trigger-icon">
          {currentDomainGroup.icon('#94a3b8')}
        </span>
        <span className="domain-trigger-label">
          <span className="domain-trigger-parent">{currentDomainGroup.shortLabel}</span>
          <span className="domain-trigger-sep">›</span>
          <span className="domain-trigger-name">{currentPreset.shortName}</span>
        </span>
        <svg
          className={`domain-trigger-chevron ${isOpen ? 'rotated' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className="domain-dropdown-menu cascading-menu" role="listbox">
          {/* Subtle search bar */}
          <div className="domain-search-wrapper">
            <svg
              className="domain-search-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={searchInputRef}
              type="text"
              className="domain-search-input"
              placeholder="Search frameworks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setIsOpen(false);
                if (e.key === 'Enter' && frameworksForActiveDomain.length > 0) {
                  handleSelectFramework(frameworksForActiveDomain[0].id);
                }
              }}
            />
            {searchQuery && (
              <button
                type="button"
                className="domain-search-clear"
                onClick={() => setSearchQuery('')}
                title="Clear"
              >
                ×
              </button>
            )}
          </div>

          <div className="domain-cascading-layout">
            {/* Left Side: Broader Domain Categories with Side Arrow */}
            {!searchQuery.trim() && (
              <div className="domain-category-column">
                <div className="domain-column-header">Domain</div>
                <div className="domain-category-list">
                  {DOMAIN_GROUPS.map((group) => {
                    const isActive = group.key === hoveredCategory;
                    const isSelectedParent = group.key === currentPreset.category;
                    return (
                      <button
                        key={group.key}
                        type="button"
                        className={`domain-category-row ${isActive ? 'active' : ''} ${
                          isSelectedParent ? 'selected-parent' : ''
                        }`}
                        onMouseEnter={() => setHoveredCategory(group.key)}
                        onClick={() => setHoveredCategory(group.key)}
                      >
                        <span className="domain-row-icon">
                          {group.icon(isActive ? '#f1f5f9' : '#94a3b8')}
                        </span>
                        <span className="domain-row-label">{group.label}</span>
                        <svg
                          className="domain-side-arrow"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Right Side: Inner Frameworks */}
            <div className={`domain-frameworks-column ${searchQuery.trim() ? 'full-width' : ''}`}>
              <div className="domain-column-header">
                {searchQuery.trim()
                  ? `Search Results (${frameworksForActiveDomain.length})`
                  : `${DOMAIN_GROUPS.find((g) => g.key === hoveredCategory)?.label || 'Frameworks'}`}
              </div>

              <div className="domain-frameworks-list">
                {frameworksForActiveDomain.length === 0 ? (
                  <div className="domain-empty-hint">No frameworks found</div>
                ) : (
                  frameworksForActiveDomain.map((framework) => {
                    const isSelected = framework.id === currentPreset.id;
                    return (
                      <button
                        key={framework.id}
                        type="button"
                        className={`domain-framework-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleSelectFramework(framework.id)}
                      >
                        <div className="domain-framework-content">
                          <div className="domain-framework-title-row">
                            <span className="domain-framework-name">{framework.name}</span>
                            {isSelected && (
                              <span className="domain-framework-check">✓</span>
                            )}
                          </div>
                          <div className="domain-framework-tagline">{framework.tagline}</div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const FrameworkSelector: React.FC<DomainSelectorProps> = (props) => {
  return <DomainSelector {...props} />;
};
