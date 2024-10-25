import React, { useEffect, useState } from 'react';
import { AppBar, Container, IconButton, Toolbar } from '@mui/material';
import { useGitHub } from '../../main/github';
import { User } from '../../github/user';

export interface AppBarProps {}

const AppContextBar: React.FC<AppBarProps> = () => {
  const [user, setUser] = useState<User | null>(null);

  const github = useGitHub();

  useEffect(() => {
    github?.users.getAuthenticated().then((user) => setUser(user.data));
  }, [github]);

  console.log(user)

  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <IconButton>
            <img src={user?.avatar_url} alt="Profile" />
          </IconButton>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export { AppContextBar };
