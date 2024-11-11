import { Components } from '@mui/material';

export const MuiPaper: Components['MuiPaper'] = {
  defaultProps: {
    variant: 'outlined',
  },
  styleOverrides: {
    outlined: ({ theme }: any) => ({
      backgroundColor: theme.palette.background.default,
      border: `1px solid ${theme.palette.grey['500']}`,
    }),
  },
};
