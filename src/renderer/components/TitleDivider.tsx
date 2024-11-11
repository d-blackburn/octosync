import React, { ReactElement } from 'react';
import { Divider, Grid2, Typography } from '@mui/material';

export interface TitleDividerProps {
  title: string | ReactElement;
}

const TitleDivider: React.FC<TitleDividerProps> = ({ title }) => {
  return (
    <Grid2 container spacing={1} alignItems="center">
      <Grid2 size="grow">
        <Divider />
      </Grid2>
      <Grid2>
        {typeof title === 'string' ? (
          <Typography color="textSecondary" variant="body2">
            {title}
          </Typography>
        ) : (
          title
        )}
      </Grid2>
      <Grid2 size="grow">
        <Divider />
      </Grid2>
    </Grid2>
  );
};
export { TitleDivider };
