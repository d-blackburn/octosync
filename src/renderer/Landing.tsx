import React from 'react';
import { Button, Container, Grid2, Typography } from '@mui/material';

export interface LandingPageProps {}

const LandingPage: React.FC<LandingPageProps> = () => {
  return (
    <Container
      maxWidth={false}
      sx={{ height: 'inherit', alignContent: 'center' }}
    >
      <Grid2 container spacing={2} justifyContent="center" alignItems="center">
        <Grid2>
          <Typography>GitHub Toolkit</Typography>
        </Grid2>
        <Grid2>
          <Button color="success">Sign into GitHub</Button>
        </Grid2>
      </Grid2>
    </Container>
  );
};
export default LandingPage;
