import { Components } from '@mui/material';

export const MuiContainer: Components['MuiContainer'] = {
  styleOverrides: {
    root: ({ theme }: any) => ({
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    }),
  },
};
