import React, { useCallback, useEffect } from 'react';
import {
  AppBar,
  Avatar,
  Breadcrumbs,
  Grid2,
  IconButton,
  Link,
  Toolbar,
  Typography,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { AccountDrawer } from './AccountDrawer';

import OctoSyncLogo from '../../../assets/icons/favicon-96x96.png';
import { useGitHub } from '../hooks/github';
import { pageTitles } from '../routing/appContextBarOptions';

export interface AppBarProps {}

const AppContextBar: React.FC<AppBarProps> = () => {
  const [drawerOpen, setDrawerOpen] = React.useState<boolean>(false);
  const [pathnames, setPathnames] = React.useState<string[]>([]);

  const { user } = useGitHub();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setPathnames(location.pathname.split('/').filter((x) => x));
  }, [location]);

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
                  style={{ display: 'block', cursor: 'pointer' }}
                  alt="OctoSync Logo"
                />
              </Grid2>
              <Grid2>
                <Breadcrumbs>
                  {pathnames.map((value, index) => {
                    const last = index === pathnames.length - 1;
                    const to = `/${pathnames.slice(0, index + 1).join('/')}`;

                    // Split value so the string can be transformed and parsed later.
                    const path = value.split('-');
                    // Convert first char of string to uppercase.
                    path.forEach((item, i) => {
                      // Only capitalize starting from the second element.
                      if (i > 0) {
                        path[i] =
                          path[i].charAt(0).toUpperCase() + path[i].slice(1);
                      }
                    });

                    return last ? (
                      <Typography color="textPrimary" variant="h6" key={to}>
                        {pageTitles[to]}
                      </Typography>
                    ) : (
                      // eslint-disable-next-line jsx-a11y/anchor-is-valid
                      <Link
                        color="textSecondary"
                        underline="hover"
                        onClick={() => navigate(to)}
                        key={to}
                        variant="h6"
                        sx={{ cursor: 'pointer' }}
                      >
                        {pageTitles[to]}
                      </Link>
                    );
                  })}
                </Breadcrumbs>
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
