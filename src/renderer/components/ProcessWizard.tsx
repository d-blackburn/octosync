import React from 'react';
import { Grid2 } from '@mui/material';

export interface ProcessWizardProps {}

const ProcessWizard: React.FC<ProcessWizardProps> = () => {
  return (
    <Grid2 container height="100%">
      <Grid2 container size={3}></Grid2>
      <Grid2 container size="grow"></Grid2>
    </Grid2>
  );
};
export { ProcessWizard };
