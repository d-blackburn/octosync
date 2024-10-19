import { alpha, Components } from '@mui/material';

export const MuiListItemButton: Components['MuiListItemButton'] = {
  styleOverrides: {
    root: ({ theme }: any) => ({
      '&.Mui-selected': {
        boxShadow: `inset 0px 0px 0px 1px ${alpha(theme.palette.primary.main, 0.5)}`,
      },
    }),
  },
};
