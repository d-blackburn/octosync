import React from 'react';
import { Container, Grid2 } from '@mui/material';
import { DestinationSection } from '../components/DestinationSection';

export interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = () => {
  return (
    <Container maxWidth="xl">
      <Grid2 container justifyContent="center" spacing={2}>
        <Grid2 size={4}>
          <DestinationSection
            title="Template Sync"
            destination="/-/templates"
            description="Easily synchronise your Issue/ Pull Request templates for your repositories."
            external={false}
          />
        </Grid2>
        <Grid2 size={4}>
          <DestinationSection
            title="Label Sync"
            destination="/-/labels"
            description="Easily synchronise your labels across your repositories."
            external={false}
          />
        </Grid2>
      </Grid2>
    </Container>
  );
};
export { Dashboard };
