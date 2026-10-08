import React from 'react';
import { ArchitectureTier } from '../../types';

export type DomainCategory = 'all' | 'frontend' | 'backend' | 'mobile' | 'systems' | 'universal';

export interface CardArchetypeDef {
  type: string;
  label: string;
  tier: ArchitectureTier;
  subType?: string;
  tech?: string;
  description?: string;
}

export interface FrameworkPreset {
  id: string;
  name: string;
  shortName: string;
  category: Exclude<DomainCategory, 'all'>;
  tagline: string;
  accentColor: string;
  icon: (color: string) => React.ReactNode;
  archetypes: CardArchetypeDef[];
}
