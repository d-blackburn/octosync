import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  CardContent,
  CircularProgress,
  Collapse,
  Container,
  Divider,
  Grid2,
  Link,
  Paper,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';
import { GitHub } from '@mui/icons-material';
import {
  DeviceAuthResponse,
  deviceAuthResponseInitialState,
} from '../../github/deviceAuthResponse';

import Wordmark from '../../../assets/logos/OctoSync Wordmark.png';

export interface LandingPageProps {}

const LandingPage: React.FC<LandingPageProps> = () => {
  const [deviceAuthResponse, setDeviceAuthResponse] =
    useState<DeviceAuthResponse>(deviceAuthResponseInitialState);
  const [reveal, setReveal] = useState<boolean>(false);

  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const handleGitHubAuthInfo = (event: any, data: DeviceAuthResponse) => {
      setDeviceAuthResponse(data);
    };

    window.electron.ipcRenderer.addGitHubDeviceAuthListener(
      handleGitHubAuthInfo,
    );

    // Clean up the listener when the component unmounts
    return () => {
      window.electron.ipcRenderer.removeGitHubDeviceAuthListener(
        handleGitHubAuthInfo,
      );
    };
  }, [navigate]);

  const handleLoginClick = useCallback(() => {
    setReveal(true);
    window.electron.ipcRenderer.loginWithGitHub();
  }, []);

  const handleRepositoryClick = useCallback(() => {
    window.open('https://github.com/d-blackburn/octosync', '_blank');
  }, []);

  const copyCodeToClipboard = useCallback(() => {
    if (deviceAuthResponse !== deviceAuthResponseInitialState) {
      navigator.clipboard.writeText(deviceAuthResponse?.user_code);
    }
  }, [deviceAuthResponse]);

  const isWaiting = deviceAuthResponse !== deviceAuthResponseInitialState;

  return (
    <Container
      maxWidth="lg"
      sx={{
        height: 'inherit',
        alignContent: 'center',
        bgcolor: theme.palette.info.main,
      }}
    >
      <Grid2 container alignContent="center" justifyContent="center">
        <Grid2 size={6}>
          <Paper variant="outlined">
            <CardContent>
              <Grid2
                container
                spacing={2}
                justifyContent="center"
                alignItems="center"
              >
                <Grid2 size={10} textAlign="center">
                  <img src={Wordmark} alt="OctoSync Wordmark" width="100%" />
                </Grid2>
                <Grid2 container>
                  <Collapse in={reveal}>
                    <Grid2 container spacing={1}>
                      <Grid2>
                        <QRCodeSVG
                          value={deviceAuthResponse.verification_uri}
                          size={126}
                          level="H"
                        />
                      </Grid2>
                      <Grid2 container size="grow" alignItems="center">
                        <Grid2 container textAlign="center">
                          <Grid2>
                            <Typography>
                              Scan the QR code or click the code below and paste
                              it to authenticate with GitHub
                            </Typography>
                          </Grid2>
                          <Grid2 size="grow">
                            <Tooltip title="Copy + Open URL" arrow>
                              <Typography
                                variant="h4"
                                fontWeight="bold"
                                color="textSecondary"
                                component={Link}
                                onClick={copyCodeToClipboard}
                                href={deviceAuthResponse.verification_uri}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {deviceAuthResponse.user_code}
                              </Typography>
                            </Tooltip>
                          </Grid2>
                        </Grid2>
                      </Grid2>
                    </Grid2>
                  </Collapse>
                </Grid2>
              </Grid2>
            </CardContent>
            <Divider />
            <CardContent>
              <Grid2 container justifyContent="flex-end" spacing={1}>
                <Grid2>
                  <Button
                    color="default"
                    onClick={handleRepositoryClick}
                    startIcon={<GitHub />}
                  >
                    Repository
                  </Button>
                </Grid2>
                <Grid2>
                  <Button
                    color="success"
                    onClick={handleLoginClick}
                    disabled={isWaiting}
                    endIcon={
                      isWaiting && (
                        <CircularProgress size={20} color="disabled" />
                      )
                    }
                  >
                    {isWaiting === false
                      ? 'Login with GitHub'
                      : 'Waiting for authentication response'}
                  </Button>
                </Grid2>
              </Grid2>
            </CardContent>
          </Paper>
        </Grid2>
      </Grid2>
    </Container>
  );
};
export default LandingPage;
