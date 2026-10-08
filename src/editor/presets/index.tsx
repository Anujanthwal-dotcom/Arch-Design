import React from 'react';
import { FrameworkPreset, DomainCategory } from './types';

export * from './types';

export const PRESET_CATEGORIES: { id: DomainCategory; label: string }[] = [
  { id: 'all', label: 'All Frameworks' },
  { id: 'frontend', label: 'Web & Frontend' },
  { id: 'backend', label: 'Backend & APIs' },
  { id: 'mobile', label: 'Mobile' },
  { id: 'systems', label: 'Systems & Runtime' },
  { id: 'universal', label: 'Architecture Patterns' },
];

export const FRAMEWORK_PRESETS: FrameworkPreset[] = [
  // --- Universal & Architecture Patterns ---
  {
    id: 'universal',
    name: 'Universal Standard',
    shortName: 'Universal',
    category: 'universal',
    tagline: 'Standard architecture cards & arbitrary custom nodes',
    accentColor: '#38bdf8',
    icon: (color) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    archetypes: [
      { type: 'module', label: 'Module', tier: 'container' },
      { type: 'component', label: 'Component', tier: 'presentation' },
      { type: 'service', label: 'Service', tier: 'logic' },
      { type: 'type', label: 'Type', tier: 'contract' },
      { type: 'function', label: 'Function', tier: 'execution' },
      { type: 'external', label: 'External', tier: 'infrastructure' },
    ],
  },
  {
    id: 'clean-arch',
    name: 'Clean Architecture / Hexagonal',
    shortName: 'Clean Arch',
    category: 'universal',
    tagline: 'Entities, UseCases, Interface Adapters, Ports & Gateways',
    accentColor: '#8b5cf6',
    icon: (color) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" fill={color} />
      </svg>
    ),
    archetypes: [
      { type: 'entity', subType: 'domain-entity', label: 'Domain Entity', tier: 'contract' },
      { type: 'usecase', subType: 'interactor', label: 'UseCase / Interactor', tier: 'logic' },
      { type: 'controller', subType: 'adapter', label: 'Controller / Adapter', tier: 'logic' },
      { type: 'type', subType: 'port-interface', label: 'Port / Gateway', tier: 'contract' },
      { type: 'component', subType: 'presenter', label: 'Presenter / UI', tier: 'presentation' },
      { type: 'external', tech: 'infra-driver', label: 'Infrastructure', tier: 'infrastructure' },
    ],
  },

  // --- Web & Frontend ---
  {
    id: 'nextjs',
    name: 'Next.js (App Router)',
    shortName: 'Next.js',
    category: 'frontend',
    tagline: 'App Router, React Server Components, Server Actions, Zustand',
    accentColor: '#f59e0b',
    icon: (color) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
        <polygon points="12 2 2 22 22 22 12 2" />
        <line x1="12" y1="10" x2="12" y2="16" />
        <circle cx="12" cy="18" r="0.5" fill={color} />
      </svg>
    ),
    archetypes: [
      { type: 'page', subType: 'nextjs', label: 'Page / Layout', tier: 'presentation' },
      { type: 'component', subType: 'react-rsc', label: 'Component (RSC/Client)', tier: 'presentation' },
      { type: 'store', subType: 'zustand', label: 'Store / Hook', tier: 'logic' },
      { type: 'action', subType: 'server-action', label: 'Server Action', tier: 'execution' },
      { type: 'schema', subType: 'zod', label: 'Schema (Zod/DTO)', tier: 'contract' },
      { type: 'external', tech: 'database-api', label: 'API / Database', tier: 'infrastructure' },
    ],
  },
  {
    id: 'react',
    name: 'React SPA (Vite / CRA)',
    shortName: 'React SPA',
    category: 'frontend',
    tagline: 'Views, Components, Custom Hooks, Redux/Zustand, REST clients',
    accentColor: '#06b6d4',
    icon: (color) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
        <circle cx="12" cy="12" r="2" fill={color} />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(30 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(90 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(150 12 12)" />
      </svg>
    ),
    archetypes: [
      { type: 'view', subType: 'router-view', label: 'View / Route', tier: 'presentation' },
      { type: 'component', subType: 'react-ui', label: 'UI Component', tier: 'presentation' },
      { type: 'hook', subType: 'custom-hook', label: 'Custom Hook', tier: 'logic' },
      { type: 'store', subType: 'state-store', label: 'Store (Zustand/Redux)', tier: 'logic' },
      { type: 'service', subType: 'api-client', label: 'API Client', tier: 'logic' },
      { type: 'type', subType: 'ts-type', label: 'Type / DTO', tier: 'contract' },
    ],
  },
  {
    id: 'vue-nuxt',
    name: 'Nuxt 3 / Vue',
    shortName: 'Nuxt / Vue',
    category: 'frontend',
    tagline: 'Nuxt 3 pages, Vue SFC, Pinia stores, Nitro server engine',
    accentColor: '#10b981',
    icon: (color) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
        <path d="M2 3h4l6 10 6-10h4L12 21 2 3z" />
        <path d="M7 3l5 8 5-8" />
      </svg>
    ),
    archetypes: [
      { type: 'page', subType: 'nuxt-page', label: 'Page / Route', tier: 'presentation' },
      { type: 'component', subType: 'vue-sfc', label: 'Component', tier: 'presentation' },
      { type: 'composable', subType: 'vue-composable', label: 'Composable', tier: 'logic' },
      { type: 'store', subType: 'pinia', label: 'Pinia Store', tier: 'logic' },
      { type: 'endpoint', subType: 'nitro-endpoint', label: 'Nitro Route', tier: 'execution' },
      { type: 'external', tech: 'api-service', label: 'API Service', tier: 'infrastructure' },
    ],
  },

  // --- Backend & APIs ---
  {
    id: 'nestjs',
    name: 'NestJS',
    shortName: 'NestJS',
    category: 'backend',
    tagline: 'Enterprise TypeScript, Controllers, Injectable Providers, Guards, DTOs',
    accentColor: '#e11d48',
    icon: (color) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    archetypes: [
      { type: 'module', subType: 'nest-module', label: 'Nest Module', tier: 'container' },
      { type: 'controller', subType: 'rest-controller', label: 'Controller', tier: 'logic' },
      { type: 'service', subType: 'injectable-provider', label: 'Service / Provider', tier: 'logic' },
      { type: 'interceptor', subType: 'guard-pipe', label: 'Guard / Interceptor', tier: 'logic' },
      { type: 'dto', subType: 'class-validator', label: 'DTO / Schema', tier: 'contract' },
      { type: 'external', tech: 'typeorm-prisma', label: 'Database / ORM', tier: 'infrastructure' },
    ],
  },
  {
    id: 'springboot',
    name: 'Spring Boot',
    shortName: 'Spring Boot',
    category: 'backend',
    tagline: 'Java / Kotlin, Spring Web MVC, JPA Repositories, Entities, Feign',
    accentColor: '#22c55e',
    icon: (color) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
        <path d="M12 2C6.48 2 2 6.48 2 12c0 3.7 2.01 6.94 5 8.66V15a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v5.66c2.99-1.72 5-4.96 5-8.66 0-5.52-4.48-10-10-10z" />
        <circle cx="12" cy="7" r="1.5" fill={color} />
      </svg>
    ),
    archetypes: [
      { type: 'controller', subType: 'rest-controller', label: 'RestController', tier: 'logic' },
      { type: 'service', subType: 'spring-service', label: 'Service', tier: 'logic' },
      { type: 'repository', subType: 'jpa-repository', label: 'Repository', tier: 'logic' },
      { type: 'entity', subType: 'jpa-entity', label: 'Entity', tier: 'contract' },
      { type: 'dto', subType: 'record-dto', label: 'DTO / Record', tier: 'contract' },
      { type: 'external', tech: 'postgresql', label: 'Database / Queue', tier: 'infrastructure' },
    ],
  },
  {
    id: 'fastapi',
    name: 'FastAPI / Python',
    shortName: 'FastAPI',
    category: 'backend',
    tagline: 'Async Python, APIRouters, Pydantic schemas, SQLAlchemy/Tortoise',
    accentColor: '#059669',
    icon: (color) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    archetypes: [
      { type: 'controller', subType: 'api-router', label: 'APIRouter', tier: 'logic' },
      { type: 'service', subType: 'domain-service', label: 'Domain Service', tier: 'logic' },
      { type: 'schema', subType: 'pydantic', label: 'Pydantic Model', tier: 'contract' },
      { type: 'entity', subType: 'sqlalchemy', label: 'ORM Entity', tier: 'contract' },
      { type: 'function', subType: 'fastapi-dep', label: 'Dependency / Helper', tier: 'execution' },
      { type: 'external', tech: 'postgres-redis', label: 'Database / Cache', tier: 'infrastructure' },
    ],
  },
  {
    id: 'backend',
    name: 'Modular Backend (Generic)',
    shortName: 'Modular Backend',
    category: 'backend',
    tagline: 'Modular monoliths, microservices, services, controllers, databases',
    accentColor: '#a855f7',
    icon: (color) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
        <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
        <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
        <line x1="6" y1="6" x2="6.01" y2="6" />
        <line x1="6" y1="18" x2="6.01" y2="18" />
      </svg>
    ),
    archetypes: [
      { type: 'module', label: 'Module', tier: 'container' },
      { type: 'service', label: 'Service', tier: 'logic' },
      { type: 'controller', subType: 'controller', label: 'Controller', tier: 'logic' },
      { type: 'function', label: 'Function', tier: 'execution' },
      { type: 'type', subType: 'model', label: 'Model / DTO', tier: 'contract' },
      { type: 'external', tech: 'database', label: 'Database', tier: 'infrastructure' },
    ],
  },

  // --- Mobile ---
  {
    id: 'android',
    name: 'Android (Jetpack Compose)',
    shortName: 'Android (Compose)',
    category: 'mobile',
    tagline: 'Compose screens, StateFlow, ViewModel, UseCases, Room DB',
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
    archetypes: [
      { type: 'screen', subType: 'composable', label: 'Screen Composable', tier: 'presentation' },
      { type: 'viewmodel', subType: 'stateflow', label: 'ViewModel', tier: 'logic' },
      { type: 'usecase', subType: 'domain', label: 'UseCase', tier: 'logic' },
      { type: 'repository', subType: 'repo', label: 'Repository', tier: 'logic' },
      { type: 'dao', subType: 'room', label: 'DAO / Entity', tier: 'contract' },
      { type: 'external', tech: 'room', label: 'Room DB', tier: 'infrastructure' },
    ],
  },
  {
    id: 'ios',
    name: 'iOS (SwiftUI)',
    shortName: 'iOS (SwiftUI)',
    category: 'mobile',
    tagline: 'SwiftUI views, Observable, Coordinators, Repositories, SwiftData',
    accentColor: '#0ea5e9',
    icon: (color) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
        <rect x="5" y="2" width="14" height="20" rx="3" ry="3" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
        <line x1="9" y1="5" x2="15" y2="5" />
      </svg>
    ),
    archetypes: [
      { type: 'view', subType: 'swiftui', label: 'SwiftUI View', tier: 'presentation' },
      { type: 'viewmodel', subType: 'observable', label: 'ViewModel', tier: 'logic' },
      { type: 'coordinator', subType: 'navigation', label: 'Coordinator', tier: 'logic' },
      { type: 'repository', subType: 'repo', label: 'Repository', tier: 'logic' },
      { type: 'model', subType: 'swiftdata', label: 'Model', tier: 'contract' },
      { type: 'external', tech: 'swiftdata', label: 'SwiftData', tier: 'infrastructure' },
    ],
  },
  {
    id: 'flutter',
    name: 'Flutter (BLoC / Riverpod)',
    shortName: 'Flutter',
    category: 'mobile',
    tagline: 'Widgets, BLoC / Riverpod, UseCases, Repositories, Data Sources',
    accentColor: '#38bdf8',
    icon: (color) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
        <path d="M14 2L4 12l4 4 12-12h-6z" />
        <path d="M14 14l-4 4 4 4h6l-6-6-4-2" />
      </svg>
    ),
    archetypes: [
      { type: 'screen', subType: 'widget', label: 'Widget / Screen', tier: 'presentation' },
      { type: 'viewmodel', subType: 'bloc-cubit', label: 'BLoC / Provider', tier: 'logic' },
      { type: 'usecase', subType: 'usecase', label: 'UseCase', tier: 'logic' },
      { type: 'repository', subType: 'repo', label: 'Repository', tier: 'logic' },
      { type: 'type', subType: 'freezed-model', label: 'Model / Entity', tier: 'contract' },
      { type: 'external', tech: 'sqlite-api', label: 'Local DB / API', tier: 'infrastructure' },
    ],
  },

  // --- Systems & Runtime ---
  {
    id: 'systems',
    name: 'Systems (Rust / Tokio)',
    shortName: 'Rust (Systems)',
    category: 'systems',
    tagline: 'Crates, Structs, Traits, Tokio async runtimes, epoll & FFI',
    accentColor: '#f97316',
    icon: (color) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" y1="19" x2="20" y2="19" />
      </svg>
    ),
    archetypes: [
      { type: 'crate', subType: 'crate', label: 'Crate / Mod', tier: 'container' },
      { type: 'struct', subType: 'struct', label: 'Struct', tier: 'contract' },
      { type: 'trait', subType: 'trait', label: 'Trait', tier: 'contract' },
      { type: 'enum', subType: 'enum', label: 'Enum', tier: 'contract' },
      { type: 'function', subType: 'fn', label: 'Function', tier: 'execution' },
      { type: 'external', tech: 'ffi-tokio', label: 'Driver / FFI', tier: 'infrastructure' },
    ],
  },
  {
    id: 'go-clean',
    name: 'Go (Clean Architecture)',
    shortName: 'Go (Clean)',
    category: 'systems',
    tagline: 'Go packages, HTTP Handlers, Usecases, Repositories, Structs',
    accentColor: '#00add8',
    icon: (color) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
        <circle cx="8" cy="12" r="4" />
        <circle cx="16" cy="12" r="4" />
        <path d="M12 4v4m0 8v4" />
      </svg>
    ),
    archetypes: [
      { type: 'module', subType: 'go-pkg', label: 'Go Package', tier: 'container' },
      { type: 'controller', subType: 'http-handler', label: 'HTTP Handler', tier: 'logic' },
      { type: 'usecase', subType: 'usecase', label: 'Usecase', tier: 'logic' },
      { type: 'repository', subType: 'repo', label: 'Repository', tier: 'logic' },
      { type: 'struct', subType: 'go-struct', label: 'Struct / Model', tier: 'contract' },
      { type: 'external', tech: 'sql-db', label: 'Database / Driver', tier: 'infrastructure' },
    ],
  },
];

/**
 * Resolves a FrameworkPreset given an ID, framework name, or legacy domain.
 * Gracefully maps old domain presets (frontend, mobile, systems, etc.) to canonical presets.
 */
export function resolvePreset(idOrDomain?: string): FrameworkPreset {
  const norm = (idOrDomain || 'universal').toLowerCase().trim();

  // Direct ID match
  const directMatch = FRAMEWORK_PRESETS.find((p) => p.id === norm);
  if (directMatch) return directMatch;

  // Legacy domain aliases
  if (norm === 'frontend' || norm === 'web') {
    return FRAMEWORK_PRESETS.find((p) => p.id === 'nextjs') || FRAMEWORK_PRESETS[0];
  }
  if (norm === 'mobile') {
    return FRAMEWORK_PRESETS.find((p) => p.id === 'android') || FRAMEWORK_PRESETS[0];
  }
  if (norm === 'rust') {
    return FRAMEWORK_PRESETS.find((p) => p.id === 'systems') || FRAMEWORK_PRESETS[0];
  }
  if (norm === 'swift') {
    return FRAMEWORK_PRESETS.find((p) => p.id === 'ios') || FRAMEWORK_PRESETS[0];
  }
  if (norm === 'kotlin') {
    return FRAMEWORK_PRESETS.find((p) => p.id === 'android') || FRAMEWORK_PRESETS[0];
  }

  // Fallback to universal
  return FRAMEWORK_PRESETS.find((p) => p.id === 'universal') || FRAMEWORK_PRESETS[0];
}
