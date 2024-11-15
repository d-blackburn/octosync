import React, { useCallback } from 'react';
import {
  Avatar,
  Box,
  CircularProgress,
  Collapse,
  Grid2,
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Paper,
  Toolbar,
  Typography,
} from '@mui/material';
import { Dictionary } from 'lodash';
import { TransitionGroup } from 'react-transition-group';
import { Repository } from '../../github/repository';

export interface RepositorySelectorProps {
  repositories: Dictionary<Repository[]> | null;
  selected: Repository[];
  onChange: (repositories: Repository[]) => void;
  multi?: boolean | undefined;
  loading?: boolean | undefined;
  error?: boolean | undefined;
  helperText?: string | string[] | false | undefined;
}

const RepositorySelector: React.FC<RepositorySelectorProps> = ({
  repositories,
  selected,
  onChange,
  multi = false,
  loading = false,
  error = false,
  helperText = false,
}) => {
  const handleClick = useCallback(
    (repository: Repository) => () => {
      const value = multi ? [...selected, repository] : [repository];

      onChange(
        selected?.map((r) => r.id).includes(repository.id)
          ? selected.filter((r) => r !== repository)
          : value,
      );
    },
    [multi, selected, onChange],
  );

  return !loading ? (
    <TransitionGroup>
      <Grid2 container spacing={2} justifyContent="center">
        <Grid2 size={12}>
          <Paper sx={{ height: '100%' }}>
            <List
              sx={{
                width: '100%',
                maxWidth: 360,
                bgcolor: 'background.paper',
                position: 'relative',
                overflow: 'auto',
                maxHeight: 300,
                '& ul': { padding: 0 },
              }}
              subheader={<li />}
            >
              {repositories &&
                Object.entries(repositories).map(([owner, repos]) => (
                  <li key={owner}>
                    <ul>
                      <ListSubheader>
                        <Toolbar disableGutters>
                          <Avatar sx={{ width: 32, height: 32 }}>
                            <img
                              src={repos[0].owner.avatar_url}
                              height="100%"
                              alt="Profile Avatar"
                            />
                          </Avatar>
                          <Typography marginLeft={1}>{owner}</Typography>
                        </Toolbar>
                      </ListSubheader>
                      {repos.map((repo: Repository) => (
                        <ListItemButton
                          key={repo.full_name}
                          onClick={handleClick(repo)}
                          selected={selected.some((s) => s.id === repo.id)}
                        >
                          <ListItemText primary={repo.name} />
                        </ListItemButton>
                      ))}
                    </ul>
                  </li>
                ))}
            </List>
          </Paper>
        </Grid2>
        {helperText && (
          <Collapse in>
            <Grid2>
              <Typography color={error ? 'error' : 'textSecondary'}>
                {helperText}
              </Typography>
            </Grid2>
          </Collapse>
        )}
      </Grid2>
    </TransitionGroup>
  ) : (
    <Box
      width="100%"
      height="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <CircularProgress />
    </Box>
  );
};
export { RepositorySelector };
