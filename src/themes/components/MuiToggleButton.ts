import { Components } from '@mui/material';

export const MuiToggleButton: Components['MuiToggleButton'] = {
  defaultProps: {
    fullWidth: true,
    color: 'primary',
  },
  styleOverrides: {
    root: {
      textTransform: 'none',
    },
  },
};
