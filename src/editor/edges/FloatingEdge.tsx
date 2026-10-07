import React from 'react';
import {
  useInternalNode,
  getSmoothStepPath,
  BaseEdge,
  EdgeProps,
} from '@xyflow/react';
import { getEdgeParams } from '../utils/floatingEdge';

export const FloatingEdge: React.FC<EdgeProps> = ({
  id,
  source,
  target,
  markerEnd,
  style,
  className,
}) => {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(
    sourceNode,
    targetNode
  );

  const [edgePath] = getSmoothStepPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetX: tx,
    targetY: ty,
    targetPosition: targetPos,
    borderRadius: 8,
  });

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      markerEnd={markerEnd}
      style={style}
      className={className}
      interactionWidth={20}
    />
  );
};
