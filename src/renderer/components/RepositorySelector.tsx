import React, { useCallback, useState } from 'react';
import {
  CardHeader,
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Paper,
} from '@mui/material';
import { Dictionary } from 'lodash';
import { Repository } from '../../github/repository';

export interface RepositorySelectorProps {
  title: string;
  subtitle: string;
  repositories: Dictionary<Repository[]> | null;
  selected: Repository[];
  onChange: (repositories: Repository[]) => void;
  multi?: boolean | undefined;
}

const RepositorySelector: React.FC<RepositorySelectorProps> = ({
  title,
  subtitle,
  repositories,
  selected,
  onChange,
  multi = false,
}) => {
  const handleClick = useCallback(
    (repository: Repository) => () => {
      onChange(
        selected?.includes(repository)
          ? selected.filter((r) => r !== repository)
          : multi
            ? [...selected, repository]
            : [repository],
      );
    },
    [selected, onChange],
  );

  return (
    <Paper>
      <CardHeader title={title} subheader={subtitle} />
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
                <ListSubheader>{owner}</ListSubheader>
                {repos.map((repo: Repository) => (
                  <ListItemButton
                    key={repo.full_name}
                    onClick={handleClick(repo)}
                    selected={selected.includes(repo)}
                  >
                    <ListItemText primary={repo.name} />
                  </ListItemButton>
                ))}
              </ul>
            </li>
          ))}
      </List>
    </Paper>
  );
};
export { RepositorySelector };
