import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Landing from './Landing';

const UnauthenticatedApp: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.electron.ipcRenderer.decryptGitHubToken().then((token) => {
      if (token != null) {
        navigate('/-/dashboard');
      }
    });
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" index element={<Landing />} />
    </Routes>
  );
};
export { UnauthenticatedApp };
