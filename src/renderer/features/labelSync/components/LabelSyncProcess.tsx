import React, { useCallback, useEffect, useState } from 'react';
import {
  Avatar,
  Button,
  CircularProgress,
  Collapse,
  Fade,
  Grid2,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  CancelOutlined,
  CheckCircleOutlined,
  HelpOutlined,
  RestartAltOutlined,
  SpaceDashboardOutlined,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { TransitionGroup } from 'react-transition-group';
import { Repository } from '../../../../github/repository';
import { ProcessData } from '../../../../models/wizards/processData';
import { ProcessStatus } from '../../../../models/wizards/processStatus';
import { ProcessState } from '../../../../models/wizards/processState';
import { useGitHub } from '../../../hooks/github';
import { LabelSyncData } from '../models/labelSyncData';

export interface TemplateSyncProcessProps {
  data: LabelSyncData;
  onRestart: () => void;
}

const LabelSyncProcess: React.FC<TemplateSyncProcessProps> = ({
  data,
  onRestart,
}) => {
  const [processes, setProcesses] = useState<ProcessData<Repository>[]>([]);
  const [inProgress, setInProgress] = useState<boolean>(false);

  const { copyContentFromRepository, copyLabelsFromRepository } = useGitHub();
  const navigate = useNavigate();

  const handleProcessUpdate = useCallback((processState: ProcessState) => {
    setProcesses((prevState) => {
      const newState = prevState.slice();
      const dataIndex = newState.findIndex(
        (p) => p.data.id === processState.id,
      );

      if (dataIndex === -1) {
        throw new Error(`Unable to find process with id: ${processState.id}`);
      }

      newState[dataIndex].states = [processState];

      return newState;
    });
  }, []);

  useEffect(() => {
    setProcesses(() => data.destinations.map((d) => ({ data: d, states: [] })));
  }, [data]);

  useEffect(() => {
    if (data.source === null) return;

    setInProgress(true);
    copyLabelsFromRepository(
      data.source,
      data.destinations,
      handleProcessUpdate,
    ).finally(() => setInProgress(false));
  }, [
    data,
    copyContentFromRepository,
    handleProcessUpdate,
    copyLabelsFromRepository,
  ]);

  const getIconForStatus = useCallback((status: ProcessStatus) => {
    switch (status) {
      case ProcessStatus.InProgress:
        return <CircularProgress color="primary" size={20} />;
      case ProcessStatus.Success:
        return <CheckCircleOutlined color="success" />;
      case ProcessStatus.Failed:
        return <CancelOutlined color="error" />;
      default:
        return <HelpOutlined />;
    }
  }, []);

  const handleGoToDashboard = useCallback(() => {
    navigate('/');
  }, [navigate]);

  return (
    <Grid2 container spacing={2}>
      <Grid2 size={12}>
        <List sx={{ maxHeight: '350px', overflowY: 'auto' }}>
          <TransitionGroup>
            {processes
              .filter((p) => p.states.length > 0)
              .reverse()
              .map(
                (process) =>
                  process.states.length > 0 && (
                    <Collapse key={process.data.id}>
                      <ListItem
                        secondaryAction={getIconForStatus(
                          process.states[0].status,
                        )}
                      >
                        <ListItemIcon sx={{ marginRight: 1 }}>
                          <Avatar>
                            <img
                              src={process.data.owner.avatar_url}
                              alt="Repository owner icon"
                              width="100%"
                            />
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={process.data.full_name}
                          secondary={process.states[0].message}
                        />
                      </ListItem>
                    </Collapse>
                  ),
              )}
          </TransitionGroup>
        </List>
      </Grid2>
      <Grid2 size={12}>
        <Fade in={processes.length > 0 && !inProgress}>
          <Grid2 container size={12} justifyContent="center" spacing={1}>
            <Grid2>
              <Button
                disabled={inProgress}
                onClick={onRestart}
                startIcon={<RestartAltOutlined />}
              >
                Start again
              </Button>
            </Grid2>
            <Grid2>
              <Button
                disabled={inProgress}
                onClick={handleGoToDashboard}
                color="success"
                startIcon={<SpaceDashboardOutlined />}
              >
                Go to Dashboard
              </Button>
            </Grid2>
          </Grid2>
        </Fade>
      </Grid2>
    </Grid2>
  );
};
export { LabelSyncProcess };
