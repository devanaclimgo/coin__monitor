import React from 'react';
import { createRoot } from 'react-dom/client';
import CurrencyDashboard from '../components/CurrencyDashboard';
import '@/styles/application.css';
import '@hotwired/turbo-rails';
import 'chart.js/auto';

document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <CurrencyDashboard />
      </React.StrictMode>
    );
  }
});