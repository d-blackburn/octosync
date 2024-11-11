import { alpha, Components, darken } from '@mui/material';
import layout from '../styles/layout.module.scss';

export const MuiInputBase: Components['MuiInputBase'] = {
  defaultProps: {
    fullWidth: true,
    size: 'small',
  },
  styleOverrides: {
    root: ({ theme, ownerState }: any) => ({
      fontSize: 13,
      width: 'auto',
      padding: 0,
      '& .MuiInputBase-input': {
        borderRadius: layout.borderRadius,
        padding: theme.spacing(0.75),
        border: `1px solid ${alpha(theme.palette[ownerState.color ?? 'primary'].main, 0.2)}`,
        boxShadow: `inset 0px 1px 0px 0px ${alpha(theme.palette[ownerState.color ?? 'primary'].main, 0.1)}`,
      },
      '& .MuiInputBase-multiline': {
        padding: 0,
      },
      '& .MuiOutlinedInput-root': {
        padding: 0,
        border: `1px solid ${darken(theme.palette[ownerState.color ?? 'primary'].main, 0.1)}`,
      },
      '& .MuiOutlinedInput-notchedOutline': {
        border: 'none',
      },
      '& .Mui-disabled': {
        paddingLeft: 0,
        paddingRight: 0,
        color: theme.palette.text.primary,
        WebkitTextFillColor: 'unset',
      },
      '.MuiInputBase-root.Mui-disabled': {
        backgroundColor: 'rgba(0,0,0,0)',
      },
      '& .MuiIcon-root': {
        cursor: 'pointer',
      },
    }),
  },
};
