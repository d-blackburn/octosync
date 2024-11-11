import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  Grid2,
  Link,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';
import { DeviceAuthResponse } from '../../github/deviceAuthResponse';

import layout from '../../themes/styles/layout.module.scss';

export interface LandingPageProps {}

const LandingPage: React.FC<LandingPageProps> = () => {
  const [deviceAuthResponse, setDeviceAuthResponse] =
    useState<DeviceAuthResponse | null>(null);

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
    window.electron.ipcRenderer.loginWithGitHub();
  }, []);

  const copyCodeToClipboard = useCallback(() => {
    if (deviceAuthResponse !== null) {
      navigator.clipboard.writeText(deviceAuthResponse?.user_code);
    }
  }, [deviceAuthResponse]);

  const isWaiting = deviceAuthResponse !== null;

  return (
    <Container maxWidth="lg" sx={{ height: 'inherit', alignContent: 'center' }}>
      <Grid2 container spacing={5} justifyContent="center" alignItems="center">
        <Grid2 size={12} textAlign="center">
          <Typography variant="h3" fontWeight="bold">
            OctoSync
          </Typography>
        </Grid2>
        {deviceAuthResponse && (
          <Grid2 size={8}>
            <Card variant="outlined" sx={{ p: 2 }}>
              <Grid2 container spacing={2}>
                <Grid2>
                  <Box
                    p={2}
                    bgcolor={theme.palette.background.default}
                    borderRadius={layout.borderRadius}
                  >
                    <QRCodeSVG
                      value={deviceAuthResponse.verification_uri}
                      size={256}
                      level="H"
                      // imageSettings={{
                      //   src: "path/to/your/logo.svg", // Path to your image
                      //   x: null, // Will be centered
                      //   y: null, // Will be centered
                      //   height: 64,
                      //   width: 64,
                      //   excavate: true, // True to make the image transparent
                      // }}
                    />
                  </Box>
                </Grid2>
                <Grid2 container size="grow" alignItems="center">
                  <Grid2 container textAlign="center">
                    <Grid2>
                      <Typography>
                        Scan the QR code or click the code below and paste it to
                        authenticate with GitHub
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
            </Card>
          </Grid2>
        )}
        <Grid2 size={12} display="flex" justifyContent="center">
          <Button
            color="success"
            onClick={handleLoginClick}
            disabled={isWaiting}
            endIcon={
              isWaiting && <CircularProgress size={20} color="disabled" />
            }
          >
            {isWaiting === false
              ? 'Login with GitHub'
              : 'Waiting for authentication response'}
          </Button>
        </Grid2>
      </Grid2>
    </Container>
  );
};
export default LandingPage;
