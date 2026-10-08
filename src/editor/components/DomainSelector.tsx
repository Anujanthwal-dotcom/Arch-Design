import React, { useState, useRef, useEffect } from 'react';
import { DomainType } from '../../types';

export type DomainOption = {
  id: DomainType | string;
  name: string;
  shortName: string;
  tagline: string;
  accentColor: string;
  icon: (color: string) => React.ReactNode;
};

const DOMAIN_OPTIONS: DomainOption[] = [
  {
    id: 'universal',
    name: 'Universal',
    shortName: 'Universal',
    tagline: 'All standard cards & custom archetypes',
    accentColor: '#38bdf8',
    icon: (color) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    id: 'backend',
    name: 'Backend',
    shortName: 'Backend',
    tagline: 'Modular monoliths, services, databases, queues',
    accentColor: '#a855f7',
    icon: (color) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
        <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
        <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
        <line x1="6" y1="6" x2="6.01" y2="6" />
        <line x1="6" y1="18" x2="6.01" y2="18" />
      </svg>
    ),
  },
  {
    id: 'frontend',
    name: 'Frontend (Web)',
    shortName: 'Frontend',
    tagline: 'Next.js App Router, React RSC, Zustand, APIs',
    accentColor: '#f59e0b',
    icon: (color) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
        <circle cx="6" cy="7" r="1" fill={color} />
        <circle cx="9" cy="7" r="1" fill={color} />
        <circle cx="12" cy="7" r="1" fill={color} />
      </svg>
    ),
  },
  {
    id: 'android',
    name: 'Android (Jetpack)',
    shortName: 'Android',
    tagline: 'Compose screens, StateFlow, Room DB, UDF',
    accentColor: '#22c55e',
    icon: (color) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
        <path d="M4 10h16v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8z" />
        <path d="M7 6l-2-3" />
        <path d="M17 6l2-3" />
        <path d="M6 10a6 6 0 0 1 12 0" />
        <circle cx="9" cy="9" r="1" fill={color} />
        <circle cx="15" cy="9" r="1" fill={color} />
      </svg>
    ),
  },
  {
    id: 'ios',
    name: 'iOS (SwiftUI)',
    shortName: 'iOS',
    tagline: 'SwiftUI views, Observable, SwiftData, Coordinators',
    accentColor: '#0ea5e9',
    icon: (color) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
        <rect x="5" y="2" width="14" height="20" rx="3" ry="3" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
        <line x1="9" y1="5" x2="15" y2="5" />
      </svg>
    ),
  },
  {
    id: 'systems',
    name: 'Systems (Rust)',
    shortName: 'Systems',
    tagline: 'Crates, Structs, Traits, Tokio, epoll & FFI',
    accentColor: '#f97316',
    icon: (color) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" y1="19" x2="20" y2="19" />
      </svg>
    ),
  },
];

export interface DomainSelectorProps {
  value: DomainType | string;
  onChange: (domain: string) => void;
}

export const DomainSelector: React.FC<DomainSelectorProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Normalize value (mapping legacy 'mobile' to 'android' or fallback)
  const normalizedValue = (value || 'universal').toLowerCase();
  const currentOption =
    DOMAIN_OPTIONS.find((o) => o.id === normalizedValue) ||
    (normalizedValue === 'mobile' ? DOMAIN_OPTIONS.find((o) => o.id === 'android') : null) ||
    DOMAIN_OPTIONS[0];

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

  const handleSelect = (id: string) => {
    onChange(id);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    } else if (e.key === 'ArrowDown' && isOpen) {
      e.preventDefault();
      const currentIndex = DOMAIN_OPTIONS.findIndex((o) => o.id === currentOption.id);
      const nextIndex = (currentIndex + 1) % DOMAIN_OPTIONS.length;
      onChange(DOMAIN_OPTIONS[nextIndex].id);
    } else if (e.key === 'ArrowUp' && isOpen) {
      e.preventDefault();
      const currentIndex = DOMAIN_OPTIONS.findIndex((o) => o.id === currentOption.id);
      const prevIndex = (currentIndex - 1 + DOMAIN_OPTIONS.length) % DOMAIN_OPTIONS.length;
      onChange(DOMAIN_OPTIONS[prevIndex].id);
    }
  };

  return (
    <div className="domain-selector" ref={containerRef}>
      <button
        type="button"
        className={`domain-trigger ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        title="Change Architectural Domain Preset"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="domain-trigger-icon" style={{ color: currentOption.accentColor }}>
          {currentOption.icon(currentOption.accentColor)}
        </span>
        <span className="domain-trigger-label">{currentOption.shortName}</span>
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
        <div className="domain-dropdown-menu" role="listbox">
          <div className="domain-dropdown-list">
            {DOMAIN_OPTIONS.map((option) => {
              const isSelected = option.id === currentOption.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  className={`domain-dropdown-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelect(option.id)}
                  role="option"
                  aria-selected={isSelected}
                >
                  <div
                    className="domain-dropdown-icon-wrapper"
                    style={{
                      backgroundColor: `${option.accentColor}18`,
                      borderColor: isSelected ? option.accentColor : 'transparent',
                    }}
                  >
                    {option.icon(option.accentColor)}
                  </div>
                  <div className="domain-dropdown-text">
                    <div className="domain-dropdown-name-row">
                      <span className="domain-dropdown-name">{option.name}</span>
                      {isSelected && (
                        <span className="domain-dropdown-check" style={{ color: option.accentColor }}>
                          ✓
                        </span>
                      )}
                    </div>
                    <div className="domain-dropdown-tagline">{option.tagline}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
