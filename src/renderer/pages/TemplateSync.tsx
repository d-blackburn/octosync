﻿import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  CircularProgress,
  Container,
  Grid2,
  LinearProgress,
  Typography,
} from '@mui/material';
import _, { Dictionary } from 'lodash';
import { RepositorySelector } from '../components/RepositorySelector';
import { Repository } from '../../github/repository';
import { useGitHub } from '../../main/github';
import { ProcessWizard } from '../components/ProcessWizard';
import { templateSyncSteps } from '../features/templateSync/models/templateSyncSteps';

export interface TemplateSyncProps {}

const TemplateSync: React.FC<TemplateSyncProps> = () => {
  const [repositories, setRepositories] = useState<Dictionary<
    Repository[]
  > | null>(null);

  const [sourceRepo, setSourceRepo] = useState<Repository[]>([]);
  const [destinationRepos, setDestinationRepos] = useState<Repository[]>([]);
  const [progressMessage, setProgressMessage] = useState<string | null>(null);
  const [progressAmount, setProgressAmount] = useState<number>(0);
  const [inProgress, setInProgress] = useState<boolean>(false);

  const { getAllReposForUser, copyTemplatesFromRepository } = useGitHub();

  useEffect(() => {
    getAllReposForUser()
      .then((repos) => setRepositories(_.groupBy(repos, 'owner.login')))
      .catch(() => console.error('Unable to retrieve repositories for User'));
  }, [getAllReposForUser]);

  const handleClick = useCallback(() => {
    setInProgress(true);
    copyTemplatesFromRepository(
      sourceRepo[0],
      destinationRepos,
      'octosync/issue-template-update',
      (message, progress) => {
        setProgressMessage(message);
        setProgressAmount(progress);
      },
    )
      .then(() => {
        setSourceRepo([]);
        setDestinationRepos([]);
      })
      .finally(() => {
        setInProgress(false);
        setProgressMessage(null);
        setProgressAmount(0);
      });
  }, [sourceRepo, destinationRepos, copyTemplatesFromRepository]);

  const ready = sourceRepo.length === 1 && destinationRepos.length > 0;

  const buttonLabel = ready
    ? `Copy ${sourceRepo[0].name} labels to ${destinationRepos.length} repo(s)`
    : `Waiting for selection`;

  return (
    <Container maxWidth={'md'} sx={{ alignContent: 'center', flexGrow: 1 }}>
      <ProcessWizard steps={templateSyncSteps} />
    </Container>
  );
};
export { TemplateSync };
