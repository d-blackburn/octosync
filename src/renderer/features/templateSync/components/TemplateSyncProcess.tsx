import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Button,
  CircularProgress,
  Fade,
  Grid2,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import {
  CancelOutlined,
  CheckCircleOutlined,
  CheckOutlined,
  ChevronRightOutlined,
  CloseOutlined,
  HelpOutlined,
  RestartAltOutlined,
  SpaceDashboardOutlined,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { TemplateSyncData } from '../models/templateSyncData';
import { Repository } from '../../../../github/repository';
import { ProcessData } from '../../../../models/wizards/processData';
import { ProcessStatus } from '../../../../models/wizards/processStatus';
import { ProcessState } from '../../../../models/wizards/processState';
import { useGitHub } from '../../../hooks/github';

export interface TemplateSyncProcessProps {
  data: TemplateSyncData;
  onRestart: () => void;
}

const TemplateSyncProcess: React.FC<TemplateSyncProcessProps> = ({
  data,
  onRestart,
}) => {
  const [processes, setProcesses] = useState<ProcessData<Repository>[]>([]);
  const [inProgress, setInProgress] = useState<boolean>(false);
  const [expanded, setExpanded] = React.useState<number | false>(false);

  const handleProcessExpand = useCallback(
    (id: number) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? id : false);
    },
    [],
  );

  const { copyContentFromRepository } = useGitHub();
  const navigate = useNavigate();

  const handleProcessUpdate = useCallback(
    (key: string) => (processState: ProcessState) => {
      setProcesses((prevState) => {
        const newState = prevState.slice();
        const dataIndex = newState.findIndex(
          (p) => p.data.id === processState.id,
        );

        if (dataIndex === -1) {
          throw new Error(`Unable to find process with id: ${processState.id}`);
        }

        const stateIndex = newState[dataIndex].states.findIndex(
          (p) => p.key === key,
        );

        if (stateIndex >= 0) {
          newState[dataIndex].states[stateIndex] = processState;
        } else {
          newState[dataIndex].states = [
            ...newState[dataIndex].states,
            processState,
          ];
        }

        return newState;
      });
    },
    [],
  );

  useEffect(() => {
    setProcesses(() => data.destinations.map((d) => ({ data: d, states: [] })));
  }, [data]);

  useEffect(() => {
    const syncTemplates = async () => {
      if (data.syncIssueTemplates) {
        const key = 'Issue Templates';
        await copyContentFromRepository(
          key,
          data,
          'octosync/issue-template-update',
          '.github/ISSUE_TEMPLATE',
          handleProcessUpdate(key),
        );
      }

      if (data.syncPullRequestTemplates) {
        const key = 'Pull Request Template';
        await copyContentFromRepository(
          key,
          data,
          'octosync/pull-request-template-update',
          '.github/pull_request_template.md',
          handleProcessUpdate(key),
        );
      }
    };

    if (data.source === null) return;

    setInProgress(true);
    syncTemplates()
      .then()
      .catch()
      .finally(() => setInProgress(false));
  }, [data, copyContentFromRepository, handleProcessUpdate]);

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

  const getProcessSummary = useCallback(
    (process: ProcessData<Repository>): ReactElement => {
      const successCount = process.states.filter(
        (s) => s.status === ProcessStatus.Success,
      ).length;

      const failCount = process.states.filter(
        (s) => s.status === ProcessStatus.Failed,
      ).length;

      return (
        <Grid2>
          <Toolbar disableGutters sx={{ minHeight: '0 !important' }}>
            <CheckOutlined color="success" fontSize="small" />
            <Typography color="textSecondary">{successCount}</Typography>
            <CloseOutlined color="error" fontSize="small" />
            <Typography color="textSecondary">{failCount}</Typography>
          </Toolbar>
        </Grid2>
      );
    },
    [],
  );

  const handleGoToDashboard = useCallback(() => {
    navigate('/');
  }, [navigate]);

  return (
    <Grid2 container spacing={2}>
      <Grid2 size={12}>
        {processes
          .filter((p) => p.states.length > 0)
          .map((process) => (
            <Accordion
              expanded={expanded === process.data.id}
              onChange={handleProcessExpand(process.data.id)}
            >
              <AccordionSummary expandIcon={<ChevronRightOutlined />}>
                <Grid2 container size={12} alignItems="center" spacing={2}>
                  <Grid2>
                    <Avatar>
                      <img
                        src={process.data.owner.avatar_url}
                        alt="Repository owner icon"
                        width="100%"
                      />
                    </Avatar>
                  </Grid2>
                  <Grid2 size="grow">
                    <Typography>{process.data.full_name}</Typography>
                  </Grid2>
                  <Grid2 container>{getProcessSummary(process)}</Grid2>
                </Grid2>
              </AccordionSummary>
              <AccordionDetails>
                <List dense>
                  {process.states.map((state) => (
                    <ListItem
                      disableGutters
                      key={`${state.id}-${state.key}`}
                      secondaryAction={getIconForStatus(state.status)}
                    >
                      <ListItemText
                        primary={state.key}
                        secondary={state.message}
                      />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          ))}
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
export { TemplateSyncProcess };
