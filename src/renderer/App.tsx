import { MemoryRouter as Router } from 'react-router-dom';
import '../themes/styles/layout.module.scss';
import React from 'react';
import { ThemeProvider } from '@mui/material';
import { lightTheme } from '../themes/light';
import { UnauthenticatedApp } from './UnauthenticatedApp';
import { AuthenticatedApp } from './AuthenticatedApp';

export default function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <Router>
        <UnauthenticatedApp />
        <AuthenticatedApp />
      </Router>
    </ThemeProvider>
  );
}
