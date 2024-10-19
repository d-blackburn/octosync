import { Components } from '@mui/material';

export const MuiAccordionDetails: Components['MuiAccordionDetails'] = {
  styleOverrides: {
    root: ({ theme }: any) => ({
      borderTop: `1px solid ${theme.palette.grey[500]}`,
    }),
  },
};
