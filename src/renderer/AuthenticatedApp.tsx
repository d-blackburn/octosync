import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Dashboard } from './Dashboard';
import { AppContextBar } from './app/AppContextBar';

const AuthenticatedApp: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.electron.ipcRenderer.decryptGitHubToken().then((token) => {
      if (token == null) {
        navigate('/');
      }
    });
  }, [navigate]);

  return (
    <>
      <AppContextBar />
      <Routes>
        <Route path="/-/">
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </>
  );
};
export { AuthenticatedApp };
