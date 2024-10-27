import { alpha, Components } from '@mui/material';

export const MuiPaper: Components['MuiPaper'] = {
  defaultProps: {
    variant: 'outlined',
  },
  styleOverrides: {
    outlined: ({ theme, ownerState }: any) => ({
      backgroundColor: ownerState.color
        ? theme.palette[ownerState.color].main
        : theme.palette.background.paper,
      border: `1px solid ${alpha(
        ownerState.color
          ? theme.palette[ownerState.color].main
          : theme.palette.background.paper,
        0.5,
      )}`,
    }),
  },
};
