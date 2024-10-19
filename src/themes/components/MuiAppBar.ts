import { Components } from '@mui/material';

export const MuiAppBar: Components['MuiAppBar'] = {
  defaultProps: {
    color: 'default',
  },
  styleOverrides: {
    colorDefault: ({ theme }: any) => ({
      backgroundColor: theme.palette.background.paper,
      borderBottom: `1px solid ${theme.palette.grey['500']}`,
    }),
  },
};
