import { darken, Components } from '@mui/material';

export const MuiButton: Components['MuiButton'] = {
  defaultProps: {
    color: 'default',
    variant: 'contained',
    size: 'small',
  },
  styleOverrides: {
    root: {
      textTransform: 'none',
      fontWeight: '700',
      minWidth: 0,
      alignSelf: 'center',
    },
    contained: ({ theme, ownerState }: any) => ({
      backgroundColor: theme.palette[ownerState.color].main,
      border: `1px solid ${theme.palette[ownerState.color].dark}`,
      boxShadow: 'none',
      '&.MuiButton-root:hover': {
        backgroundColor: darken(theme.palette[ownerState.color].main, 0.05),
        boxShadow: 'none',
      },
      '&.Mui-disabled': {
        border: `1px solid`,
      },
    }),
    text: ({ theme, ownerState }: any) => ({
      color: darken(theme.palette[ownerState.color].dark, 0.25),
      '&.MuiButton-root:hover': {
        backgroundColor: darken(theme.palette[ownerState.color].main, 0.05),
        boxShadow: 'none',
      },
    }),
  },
};
