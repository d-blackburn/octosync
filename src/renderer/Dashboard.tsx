import React from 'react';
import { Container } from '@mui/material';
import { AppContextBar } from './app/AppContextBar';

export interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = () => {
  return (
    <Container>
      <AppContextBar />
    </Container>
  );
};
export { Dashboard };
