import React from 'react';
import ReactDOM from 'react-dom/client';

const TestApp = () => {
  return <div>
    <h1>Test App Works!</h1>
    <p>If you see this, React is rendering correctly.</p>
  </div>;
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<TestApp />);
} else {
  console.error('Root element not found!');
}