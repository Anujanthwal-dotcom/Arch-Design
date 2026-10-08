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

  if (t.includes('rabbitmq') || t.includes('rabbit')) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 13.5c-.8 0-1.5.3-2 .8V7.5C17 5 15 3 12.5 3S8 5 8 7.5v1.2C6.8 9.3 6 10.5 6 12v3c0 2.2 1.8 4 4 4h5c2.2 0 4-1.8 4-4v-1.5zm-9-6c0-1.4 1.1-2.5 2.5-2.5S15 6.1 15 7.5v3.1c-.8-.4-1.8-.6-2.5-.6s-1.7.2-2.5.6V7.5zM17 15c0 1.1-.9 2-2 2h-5c-1.1 0-2-.9-2-2v-3c0-.9.6-1.7 1.5-1.9.8.6 1.7.9 2.5.9s1.7-.3 2.5-.9c.9.2 1.5 1 1.5 1.9v3z"/>
      </svg>
    );
  }

  // Mobile / Embedded storage (SQLite, Room, CoreData, SwiftData, Realm, Keychain)
  if (t.includes('sqlite') || t.includes('room') || t.includes('coredata') || t.includes('swiftdata') || t.includes('realm')) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 6V4h16v2H4zm0 4V8h16v2H4zm0 4v-2h16v2H4zm0 4v-2h16v2H4zm0 4v-2h16v2H4z"/>
      </svg>
    );
  }

  // GraphQL
  if (t.includes('graphql')) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l8.66 5v10L12 22l-8.66-5V7L12 2zm0 2.31L4.84 8.44v7.12L12 19.69l7.16-4.13V8.44L12 4.31zM12 7a2 2 0 110 4 2 2 0 010-4zm-4 7a2 2 0 110 4 2 2 0 010-4zm8 0a2 2 0 110 4 2 2 0 010-4z"/>
      </svg>
    );
  }

  // REST API / HTTP / Network
  if (t.includes('rest') || t.includes('http') || t.includes('api') || t.includes('network')) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
      </svg>
    );
  }

  // WebSockets / Event Streams
  if (t.includes('ws') || t.includes('websocket') || t.includes('socket')) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
      </svg>
    );
  }

  // LocalStorage / IndexedDB / Browser Storage / Keychain
  if (t.includes('localstorage') || t.includes('indexeddb') || t.includes('keychain') || t.includes('cache')) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
      </svg>
    );
  }

  // Tokio / Async Runtime / OS Threading
  if (t.includes('tokio') || t.includes('async') || t.includes('thread')) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M13 2.05v3.03c3.39.49 6 3.39 6 6.92 0 .9-.18 1.75-.48 2.54l2.6 1.53c.56-1.24.88-2.62.88-4.07 0-5.18-3.95-9.45-9-9.95zM12 19c-3.87 0-7-3.13-7-7 0-3.53 2.61-6.43 6-6.92V2.05c-5.05.5-9 4.76-9 9.95 0 5.52 4.47 10 9.99 10 3.31 0 6.24-1.61 8.01-4.09l-2.49-1.46C16.27 18.06 14.28 19 12 19z"/>
      </svg>
    );
  }

  // Systems / FFI / Libc / WASM / Driver / Hardware
  if (t.includes('ffi') || t.includes('libc') || t.includes('wasm') || t.includes('hardware') || t.includes('vulkan') || t.includes('driver')) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
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