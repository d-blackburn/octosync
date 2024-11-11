import React, { useCallback } from 'react';
import {
  Avatar,
  Box,
  CircularProgress,
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Paper,
  Toolbar,
  Typography,
} from '@mui/material';
import { Dictionary } from 'lodash';
import { Repository } from '../../github/repository';

export interface RepositorySelectorProps {
  repositories: Dictionary<Repository[]> | null;
  selected: Repository[];
  onChange: (repositories: Repository[]) => void;
  multi?: boolean | undefined;
  loading?: boolean | undefined;
}

const RepositorySelector: React.FC<RepositorySelectorProps> = ({
  repositories,
  selected,
  onChange,
  multi = false,
  loading = false,
}) => {
  const handleClick = useCallback(
    (repository: Repository) => () => {
      const value = multi ? [...selected, repository] : [repository];

      onChange(
        selected?.includes(repository)
          ? selected.filter((r) => r !== repository)
          : value,
      );
    },
    [multi, selected, onChange],
  );

  return (
    <Paper sx={{ height: '100%' }}>
      {!loading ? (
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
                        <img src={repos[0].owner.avatar_url} height="100%" />
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
      )}
    </Paper>
  );
};
export { RepositorySelector };
