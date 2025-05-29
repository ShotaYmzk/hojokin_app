// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Tailwind CSSを適用するためにインポート
import App from '/Users/yamazakiakirafutoshi/VScode/hojokin_ai/hojokin_app/src/App.tsx';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);