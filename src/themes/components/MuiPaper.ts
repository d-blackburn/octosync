import { alpha, Components } from '@mui/material';

export const MuiPaper: Components['MuiPaper'] = {
  styleOverrides: {
    outlined: ({ theme }: any) => ({
      backgroundColor: theme.palette.default.light,
      border: `1px solid ${alpha(theme.palette.default.light, 0.5)}`,
    }),
  },
};
