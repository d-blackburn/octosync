import { Components } from '@mui/material';

export const MuiMenu: Components['MuiMenu'] = {
  styleOverrides: {
    paper: ({ theme }: any) => ({
      backgroundColor: theme.palette.background.default,
      filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.32))',
    }),
  },
};
