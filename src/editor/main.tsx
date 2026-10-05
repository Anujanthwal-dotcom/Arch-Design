import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import '@xyflow/react/dist/style.css';
import './style.css';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}