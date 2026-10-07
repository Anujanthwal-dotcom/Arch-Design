import { InternalNode, Position } from '@xyflow/react';

export function getNodeIntersection(
  intersectionNode: InternalNode,
  targetNode: InternalNode
): { x: number; y: number } {
  const width =
    intersectionNode.measured?.width ||
    intersectionNode.width ||
    intersectionNode.initialWidth ||
    320;
  const height =
    intersectionNode.measured?.height ||
    intersectionNode.height ||
    intersectionNode.initialHeight ||
    140;

  const targetWidth =
    targetNode.measured?.width ||
    targetNode.width ||
    targetNode.initialWidth ||
    320;
  const targetHeight =
    targetNode.measured?.height ||
    targetNode.height ||
    targetNode.initialHeight ||
    140;

  const intersectionPos = intersectionNode.internals?.positionAbsolute ||
    intersectionNode.position || { x: 0, y: 0 };
  const targetPos = targetNode.internals?.positionAbsolute ||
    targetNode.position || { x: 0, y: 0 };

  const w = width / 2;
  const h = height / 2;

  const x2 = intersectionPos.x + w;
  const y2 = intersectionPos.y + h;
  const x1 = targetPos.x + targetWidth / 2;
  const y1 = targetPos.y + targetHeight / 2;

  const xx1 = (x1 - x2) / (2 * w) - (y1 - y2) / (2 * h);
  const yy1 = (x1 - x2) / (2 * w) + (y1 - y2) / (2 * h);
  const a = 1 / (Math.abs(xx1) + Math.abs(yy1) || 1);
  const xx3 = a * xx1;
  const yy3 = a * yy1;
  const x = w * (xx3 + yy3) + x2;
  const y = h * (-xx3 + yy3) + y2;

  return { x, y };
}

export function getEdgePosition(
  node: InternalNode,
  intersectionPoint: { x: number; y: number }
): Position {
  const pos = node.internals?.positionAbsolute || node.position || { x: 0, y: 0 };
  const width = node.measured?.width || node.width || node.initialWidth || 320;
  const height = node.measured?.height || node.height || node.initialHeight || 140;

  const distLeft = Math.abs(intersectionPoint.x - pos.x);
  const distRight = Math.abs(intersectionPoint.x - (pos.x + width));
  const distTop = Math.abs(intersectionPoint.y - pos.y);
  const distBottom = Math.abs(intersectionPoint.y - (pos.y + height));

  const minDist = Math.min(distLeft, distRight, distTop, distBottom);

  if (minDist === distLeft) {
    return Position.Left;
  }
  if (minDist === distRight) {
    return Position.Right;
  }
  if (minDist === distTop) {
    return Position.Top;
  }
  return Position.Bottom;
}

export function getEdgeParams(
  source: InternalNode,
  target: InternalNode
): {
  sx: number;
  sy: number;
  tx: number;
  ty: number;
  sourcePos: Position;
  targetPos: Position;
} {
  const sourceIntersectionPoint = getNodeIntersection(source, target);
  const targetIntersectionPoint = getNodeIntersection(target, source);

  const sourcePos = getEdgePosition(source, sourceIntersectionPoint);
  const targetPos = getEdgePosition(target, targetIntersectionPoint);

  return {
    sx: sourceIntersectionPoint.x,
    sy: sourceIntersectionPoint.y,
    tx: targetIntersectionPoint.x,
    ty: targetIntersectionPoint.y,
    sourcePos,
    targetPos,
  };
}
