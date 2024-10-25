import { darken, Components } from '@mui/material';

export const MuiButton: Components['MuiButton'] = {
  defaultProps: {
    variant: 'contained',
    size: 'small',
  },
  styleOverrides: {
    root: {
      textTransform: 'none',
      fontWeight: '700',
    },
    contained: ({ theme, ownerState }: any) => ({
      border: `1px solid ${darken(theme.palette[ownerState.color ?? 'primary'].main, 0.1)}`,
      boxShadow: 'none',
      backgroundColor: theme.palette[ownerState.color ?? 'primary'].main,
      '&.MuiButton-root:hover': {
        backgroundColor: darken(
          theme.palette[ownerState.color ?? 'primary'].main,
          0.15,
        ),
        boxShadow: 'none',
      },
      '&.Mui-disabled': {
        border: `1px solid`,
      },
    }),
  },
};
