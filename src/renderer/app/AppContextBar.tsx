import React, { useCallback } from 'react';
import {
  AppBar,
  Avatar,
  Grid2,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AccountDrawer } from './AccountDrawer';

import OctoSyncLogo from '../../../assets/icons/favicon-96x96.png';
import { useGitHub } from '../features/hooks/github';

export interface AppBarProps {}

const AppContextBar: React.FC<AppBarProps> = () => {
  const [drawerOpen, setDrawerOpen] = React.useState<boolean>(false);

  const { user } = useGitHub();
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    setDrawerOpen(true);
  }, []);
  const handleClose = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  const handleLogoClick = useCallback(() => {
    navigate('/');
  }, [navigate]);

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
              <Grid2 onClick={handleLogoClick}>
                <img
                  src={OctoSyncLogo}
                  width="36px"
                  style={{ display: 'block' }}
                  alt="OctoSync Logo"
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
