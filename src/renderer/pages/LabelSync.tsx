import React, { useCallback, useEffect, useState } from 'react';
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

export interface LabelSyncProps {}

const LabelSync: React.FC<LabelSyncProps> = () => {
  const [repositories, setRepositories] = useState<Dictionary<
    Repository[]
  > | null>(null);

  const [sourceRepo, setSourceRepo] = useState<Repository[]>([]);
  const [destinationRepos, setDestinationRepos] = useState<Repository[]>([]);
  const [progressMessage, setProgressMessage] = useState<string | null>(null);
  const [progressAmount, setProgressAmount] = useState<number>(0);
  const [inProgress, setInProgress] = useState<boolean>(false);

  const { getAllReposForUser, copyLabelsFromRepository } = useGitHub();

  useEffect(() => {
    getAllReposForUser()
      .then((repos) => setRepositories(_.groupBy(repos, 'owner.login')))
      .catch(() => console.error('Unable to retrieve repositories for User'));
  }, [getAllReposForUser]);

  const handleClick = useCallback(() => {
    setInProgress(true);
    copyLabelsFromRepository(
      sourceRepo[0],
      destinationRepos,
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
  }, [sourceRepo, destinationRepos, copyLabelsFromRepository]);

  const ready = sourceRepo.length === 1 && destinationRepos.length > 0;

  const buttonLabel = ready
    ? `Copy ${sourceRepo[0].name} labels to ${destinationRepos.length} repo(s)`
    : `Waiting for selection`;

  return (
    <Container sx={{ alignContent: 'center', flexGrow: 1 }}>
      <Grid2 container alignItems="center">
        <Grid2>
          <RepositorySelector
            title="Source"
            subtitle="Select a repository to copy the labels from"
            repositories={repositories}
            selected={sourceRepo}
            onChange={setSourceRepo}
          />
        </Grid2>
        <Grid2 container size="grow" justifyContent="center" spacing={1}>
          {progressMessage && (
            <Grid2 textAlign={'center'}>
              <Typography variant="body2" color="textSecondary">
                Copying labels to
              </Typography>
              <Typography variant="body1" color="textPrimary" fontWeight="bold">
                {progressMessage}
              </Typography>
            </Grid2>
          )}
          <Grid2 size={12}>
            <LinearProgress
              variant="determinate"
              value={
                inProgress
                  ? (progressAmount / destinationRepos.length) * 100
                  : 0
              }
              color={
                destinationRepos.length > 0 &&
                progressAmount === destinationRepos.length
                  ? 'success'
                  : 'primary'
              }
            />
          </Grid2>
          <Grid2>
            <Button
              color="success"
              disabled={!ready || inProgress}
              onClick={handleClick}
              endIcon={
                inProgress && <CircularProgress color="disabled" size={20} />
              }
            >
              {inProgress ? 'Copying in-progress' : buttonLabel}
            </Button>
          </Grid2>
        </Grid2>
        <Grid2>
          <RepositorySelector
            title="Destination"
            subtitle="Select all repositories to copy the labels to"
            multi
            repositories={repositories}
            selected={destinationRepos}
            onChange={setDestinationRepos}
          />
        </Grid2>
      </Grid2>
    </Container>
  );
};
export { LabelSync };
