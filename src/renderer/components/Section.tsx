import React from 'react';
import { Card, Grid2, Typography } from '@mui/material';
import { DefaultProps } from '../../models/components/defaultProps';

export interface SectionProps extends DefaultProps {
  title: string;
}

const Section: React.FC<SectionProps> = ({ title, children }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <Grid2 height="inherit" container spacing={1} direction="column">
        <Grid2>
          <Typography variant="h6" color="textPrimary">
            {title}
          </Typography>
        </Grid2>
        {children}
      </Grid2>
    </Card>
  );
};
export { Section };
