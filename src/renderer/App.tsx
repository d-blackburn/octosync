import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { ThemeProvider } from '@mui/material';
import { lightTheme } from '../themes/light';
import { AuthenticatedRoute } from './routing/AuthenticatedRoute';
import Landing from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { UnauthenticatedRoute } from './routing/UnauthenticatedRoute';
import { TemplateSync } from './pages/TemplateSync';
import { LabelSync } from './pages/LabelSync';

export default function App() {
  const [isAuthenticated, setAuthenticated] = useState<boolean>(false);

  window.electron.ipcRenderer
    .decryptGitHubToken()
    .then((token) => setAuthenticated(token !== null));

  useEffect(() => {
    const handleGitHubTokenRetrieved = () => {
      console.log('Successfully logged in with GitHub!');
      setAuthenticated(true);
    };

    const handleGitHubTokenDeleted = () => {
      console.log('Successfully logged out!');
      setAuthenticated(false);
    };

    window.electron.ipcRenderer.addGitHubTokenRetrievedListener(
      handleGitHubTokenRetrieved,
    );

    window.electron.ipcRenderer.addGitHubTokenDeletedListener(
      handleGitHubTokenDeleted,
    );

    return () => {
      window.electron.ipcRenderer.removeGitHubTokenRetrievedListener(
        handleGitHubTokenRetrieved,
      );
      window.electron.ipcRenderer.removeGitHubTokenDeletedListener(
        handleGitHubTokenDeleted,
      );
    };
  }, []);

  return (
    <ThemeProvider theme={lightTheme}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={<UnauthenticatedRoute isAuthenticated={isAuthenticated} />}
          >
            <Route index element={<Landing />} />
          </Route>

          <Route
            path="/-/"
            element={<AuthenticatedRoute isAuthenticated={isAuthenticated} />}
          >
            <Route index element={<Dashboard />} />
            <Route path="labels" element={<LabelSync />} />
            <Route path="templates" element={<TemplateSync />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
