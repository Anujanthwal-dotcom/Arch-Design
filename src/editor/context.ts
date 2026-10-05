import { createContext, useContext } from 'react';

export type CanvasContextType = {
  updateNodeData: (nodeId: string, partialData: Record<string, any>) => void;
  deleteNode: (nodeId: string) => void;
};

export const CanvasContext = createContext<CanvasContextType>({
  updateNodeData: () => {},
  deleteNode: () => {},
});

export const useCanvas = () => useContext(CanvasContext);
