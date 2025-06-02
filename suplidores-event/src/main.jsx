import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { SidebarProvider } from './context/SidebarContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <SidebarProvider>
    <App />
  </SidebarProvider>
);
