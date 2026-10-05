import React from 'react';

export type TechIconProps = {
  tech: string;
  size?: number;
};

const getTechIcon = (tech: string): React.ReactNode => {
  const t = tech.toLowerCase();
  
  if (t.includes('postgres') || t.includes('postgresql')) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 7v10l10 5 10-5V7l-10-5zm0 2.3l7.5 3.75L12 11.8 4.5 8.05 12 4.3zM4 9.8l7 3.5v7.4l-7-3.5V9.8zm9 10.9v-7.4l7-3.5v7.4l-7 3.5z"/>
      </svg>
    );
  }
  
  if (t.includes('mysql')) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M16.5 3.5l-1.4 1.4L17.6 7H17c-1.7 0-3 1.3-3 3v2h-1v2h1v2h-1v2h2v-2h1v-2h-1v-2h2v2h1v-2h-1v-2h-1v-2c0-.6.4-1 1-1h.6l-2.5 2.5 1.4 1.4 4.5-4.5-4.5-4.5zM8 4v2H6V4H4v16h2v-6h2v6h2V4H8z"/>
      </svg>
    );
  }
  
  if (t.includes('redis')) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M4.5 12.5c0-2.2 1.8-4 4-4h7c2.2 0 4 1.8 4 4s-1.8 4-4 4h-7c-2.2 0-4-1.8-4-4zm6-2h-1v4h1v-4zm3 0h-1v4h1v-4zm3 0h-1v4h1v-4z"/>
      </svg>
    );
  }
  
  if (t.includes('mongodb')) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.5c-.3 0-.6.3-.6.6v15.4l.6.5.6-.5V3.1c0-.3-.3-.6-.6-.6zM11.4 3.3c-.8.8-2.9 3.3-2.9 5.8 0 2.1 1.3 3.6 2.4 4.4l.5.5V3.3zM12.6 3.3v10.7l.5-.5c1.1-.8 2.4-2.3 2.4-4.4 0-2.5-2.1-5-2.9-5.8z"/>
      </svg>
    );
  }
  
  if (t.includes('kafka')) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3L4 7v10l8 4 8-4V7l-8-4zm0 2.2l5.8 2.9L12 11 6.2 8.1 12 5.2zM6 9.5l5 2.5v5.8L6 15.3V9.5zm7 8.3V12l5-2.5v5.8l-5 2.5z"/>
      </svg>
    );
  }
  
  if (t.includes('s3') || t.includes('minio')) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M5 3v18h14V3H5zm2 2h10v2H7V5zm0 4h10v2H7V9zm0 4h10v2H7v-2zm0 4h10v2H7v-2z"/>
      </svg>
    );
  }
  
  // Generic external icon
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
    </svg>
  );
};

export const TechIcon: React.FC<TechIconProps> = ({ tech, size = 14 }) => {
  return (
    <span className="tech-icon" style={{ width: size, height: size }}>
      {getTechIcon(tech)}
    </span>
  );
};

export const GripIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 12,
  className = 'node-grip-icon',
}) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width={size}
      height={size}
      className={className}
      style={{ display: 'block', flexShrink: 0 }}
    >
      <circle cx="8" cy="5" r="2" />
      <circle cx="16" cy="5" r="2" />
      <circle cx="8" cy="12" r="2" />
      <circle cx="16" cy="12" r="2" />
      <circle cx="8" cy="19" r="2" />
      <circle cx="16" cy="19" r="2" />
    </svg>
  );
};

export const ChevronIcon: React.FC<{ expanded: boolean; size?: number }> = ({
  expanded,
  size = 12,
}) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width={size}
      height={size}
      style={{
        transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)',
        transition: 'transform 0.15s ease',
        display: 'block',
        flexShrink: 0,
      }}
    >
      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
    </svg>
  );
};