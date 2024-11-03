import React, { useCallback, useEffect, useState } from 'react';
import {
  AppBar,
  Avatar,
  Button,
  Grid2,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import { useGitHub } from '../../main/github';
import { AccountDrawer } from './AccountDrawer';

import OctoSyncLogo from '../../../assets/icons/favicon-96x96.png';

export interface AppBarProps {}

const AppContextBar: React.FC<AppBarProps> = () => {
  const [drawerOpen, setDrawerOpen] = React.useState<boolean>(false);

  const { user } = useGitHub();

  const handleClick = useCallback(() => {
    setDrawerOpen(true);
  }, []);
  const handleClose = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Grid2
            container
            size="grow"
            spacing={1}
            justifyContent="space-between"
          >
            <Grid2 container alignItems="center" spacing={1}>
              <Grid2>
                <img
                  src={OctoSyncLogo}
                  width="36px"
                  style={{ display: 'block' }}
                />
              </Grid2>
              <Grid2>
                <Typography
                  variant="body1"
                  color="textPrimary"
                  fontWeight="bold"
                >
                  Dashboard
                </Typography>
              </Grid2>
            </Grid2>
            <Grid2 container alignItems="center">
              <Grid2 size="auto">
                <IconButton onClick={handleClick}>
                  <Avatar
                    src={user?.avatar_url}
                    alt="Profile"
                    sx={{ height: 32, width: 32 }}
                  />
                </IconButton>
              </Grid2>
            </Grid2>
          </Grid2>
        </Toolbar>
      </AppBar>
      <AccountDrawer open={drawerOpen} onClose={handleClose} user={user} />
    </>
  );
};
export { AppContextBar };
