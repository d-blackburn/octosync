import React, { useCallback } from 'react';
import { Button, Grid2, Typography } from '@mui/material';
import { ChevronRightOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Section } from './Section';

export interface DestinationSectionProps {
  title: string;
  description: string;
  destination: string;
  external: boolean;
}

const DestinationSection: React.FC<DestinationSectionProps> = ({
  title,
  description,
  destination,
  external,
}) => {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    if (external) {
      window.open(destination, '_blank');
      return;
    }
    navigate(destination);
  }, [destination, external, navigate]);

  return (
    <Section title={title}>
      <Grid2 size="grow">
        <Typography variant="body2" color="textSecondary">
          {description}
        </Typography>
      </Grid2>
      <Grid2 container justifyContent="right" spacing={1}>
        <Grid2>
          <Button onClick={handleClick} endIcon={<ChevronRightOutlined />}>
            Get started
          </Button>
        </Grid2>
      </Grid2>
    </Section>
  );
};
export { DestinationSection };
