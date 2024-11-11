import { Components } from '@mui/material';

export const MuiInputLabel: Components['MuiInputLabel'] = {
  defaultProps: {
    size: 'small',
  },
  styleOverrides: {
    root: ({ theme }: any) => ({
      display: 'contents',
      fontSize: 14,
      fontWeight: '600',
      color: theme.palette.text.primary,
      left: 0,
      boxShadow: 'none',
      border: 'none',
    }),
  },
};
