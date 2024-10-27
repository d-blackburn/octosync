import React from 'react';
import { Card, Grid2, Typography } from '@mui/material';
import { DefaultProps } from '../../models/components/defaultProps';

export interface SectionProps extends DefaultProps {
  title: string;
}

const Section: React.FC<SectionProps> = ({ title, children }) => {
  return (
    <Card>
      <Grid2 container spacing={1}>
        <Grid2>
          <Typography variant="h6" color="textPrimary">
            {title}
          </Typography>
        </Grid2>
        <Grid2 size={12}>{children}</Grid2>
      </Grid2>
    </Card>
  );
};
export { Section };
