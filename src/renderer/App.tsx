import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import React from 'react';
import { ThemeProvider } from '@mui/material';
import Landing from './Landing';
import { lightTheme } from '../themes/light';
import { Dashboard } from './Dashboard';

export default function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
