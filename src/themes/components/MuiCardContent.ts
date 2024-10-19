import { Components } from '@mui/material';

export const MuiCardContent: Components['MuiCardContent'] = {
  styleOverrides: {
    root: ({ theme }: any) => ({
      '&.MuiCardContent-root:last-child': {
        paddingBottom: theme.spacing(2),
      },
    }),
  },
};
