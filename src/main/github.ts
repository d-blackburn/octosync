import { Octokit } from '@octokit/rest';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function useGitHub() {
  const [octokit, setOctokit] = useState<Octokit | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (octokit === null) {
      window.electron.ipcRenderer
        .decryptGitHubToken()
        .then((token) => setOctokit(new Octokit({ auth: token })))
        .catch(() => navigate('/'));
    }
  }, [octokit, navigate]);

  return octokit;
}
