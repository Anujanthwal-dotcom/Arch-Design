import { v4 as uuidv4 } from 'uuid';
import { Node, Edge, Connection } from '@xyflow/react';
import { ArchitectureTier, resolveNodeTier } from '../types';

export const generateId = () => uuidv4();

export const checkValidConnection = (
  connection: Connection | Edge,
  nodes: Node[],
  edges: Edge[] = []
): boolean => {
  if (!connection.source || !connection.target) {
    return false;
  }

  if (connection.source === connection.target) {
    return false;
  }

  // Prevent duplicate edges between the same source and target
  const alreadyConnected = edges.some(
    (e) => e.source === connection.source && e.target === connection.target
  );
  if (alreadyConnected) {
    return false;
  }

  const sourceNode = nodes.find((n) => n.id === connection.source);
  const targetNode = nodes.find((n) => n.id === connection.target);

  const sourceType = String(sourceNode?.data?.nodeType || sourceNode?.type || '');
  const targetType = String(targetNode?.data?.nodeType || targetNode?.type || '');

  if (!sourceType || !targetType) {
    return false;
  }

  const sTier = resolveNodeTier(sourceType, sourceNode?.data?.tier);
  const tTier = resolveNodeTier(targetType, targetNode?.data?.tier);

  // Prohibited: direct external/infrastructure access from presentation UI
  if (sTier === 'infrastructure' && tTier === 'presentation') {
    return false;
  }
  if (sTier === 'presentation' && tTier === 'infrastructure') {
    return false;
  }

  // Prohibited: infrastructure injecting directly into infrastructure
  if (sTier === 'infrastructure' && tTier === 'infrastructure') {
    return false;
  }

  // Prohibited: container driving children (child points to parent container)
  if (sTier === 'container' && tTier !== 'container') {
    return false;
  }

  // 1. Presentation -> Presentation (UI component composition, nesting, screen transitions)
  if (sTier === 'presentation' && tTier === 'presentation') return true;

  // 2. Logic -> Presentation (ViewModel / Store / Hook provides reactive state to UI)
  if (sTier === 'logic' && tTier === 'presentation') return true;

  // 3. Presentation -> Logic (UI uses / dispatches events to ViewModel, Controller, or Store)
  if (sTier === 'presentation' && tTier === 'logic') return true;

  // 4. Logic -> Logic (ViewModel -> UseCase, UseCase -> Repository, Service -> Service)
  if (sTier === 'logic' && tTier === 'logic') return true;

  // 5. Execution -> Logic (Method / function implements business logic or service method)
  if (sTier === 'execution' && tTier === 'logic') return true;

  // 6. Execution -> Presentation (UI helper function or event handler)
  if (sTier === 'execution' && tTier === 'presentation') return true;

  // 7. Execution -> Contract (Method implemented on Struct / Trait)
  if (sTier === 'execution' && tTier === 'contract') return true;

  // 8. Contract -> Contract (Struct implements Trait, Interface inheritance)
  if (sTier === 'contract' && tTier === 'contract') return true;

  // 9. Contract -> Logic / Presentation / Execution (Data contract, DTO, or entity definition)
  if (sTier === 'contract' && (tTier === 'logic' || tTier === 'presentation' || tTier === 'execution')) return true;

  // 10. Infrastructure -> Logic (DB, API, Storage, Runtime injected into Repository or Service)
  if (sTier === 'infrastructure' && tTier === 'logic') return true;

  // 11. Infrastructure -> Container (Driver, OS, Cloud boundary injected into module/crate)
  if (sTier === 'infrastructure' && tTier === 'container') return true;

  // 12. Structural containment into Container (Feature module, Crate, Package)
  if (tTier === 'container') {
    return true;
  }

  return false;
};

export const resolveEdgeType = (
  sourceType: string,
  targetType: string,
  sourceTierExplicit?: ArchitectureTier,
  targetTierExplicit?: ArchitectureTier
): string => {
  const sTier = resolveNodeTier(sourceType, sourceTierExplicit);
  const tTier = resolveNodeTier(targetType, targetTierExplicit);

  if (sTier === 'presentation' && tTier === 'presentation') return 'renders';
  if (sTier === 'logic' && tTier === 'presentation') return 'observes';
  if (sTier === 'presentation' && tTier === 'logic') return 'uses';
  if (sTier === 'execution' && tTier === 'presentation') return 'helper';
  if (sTier === 'execution' && (tTier === 'logic' || tTier === 'contract')) return 'implements';
  if (sTier === 'contract' && tTier === 'contract') return 'implements';
  if (sTier === 'contract' && (tTier === 'logic' || tTier === 'presentation' || tTier === 'execution')) return 'defines';
  if (tTier === 'container') {
    if (sTier === 'container') return 'submodule';
    if (sTier === 'presentation') return 'belongsTo';
    if (sTier === 'contract') return 'declares';
    return 'injects';
  }
  return 'injects';
};