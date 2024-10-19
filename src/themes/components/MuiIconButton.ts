import { Components } from '@mui/material';

export const MuiIconButton: Components['MuiIconButton'] = {
  defaultProps: {
    color: 'default',
  },
  styleOverrides: {
    root: {
      padding: 0,
    },
  },
};
