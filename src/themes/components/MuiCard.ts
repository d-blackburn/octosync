import { Components } from '@mui/material';

export const MuiCard: Components['MuiCard'] = {
  defaultProps: {
    variant: 'outlined',
  },
  styleOverrides: {
    root: ({ theme }: any) => ({
      padding: `${theme.spacing(1)} ${theme.spacing(2)} ${theme.spacing(1)} ${theme.spacing(2)}`,
      backgroundColor: theme.palette.background.default,
      border: `1px solid ${theme.palette.grey['500']}`,
    }),
  },
};
