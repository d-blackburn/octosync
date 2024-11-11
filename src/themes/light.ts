import { createTheme, PaletteOptions, Theme } from '@mui/material';
import { layout } from './layout';

const palette: PaletteOptions = {
  default: {
    dark: '#d1d9e0',
    main: '#f6f8fa',
    light: '#ffffff',
    contrastText: 'rgb(31, 35, 40)',
  },
  background: {
    default: '#FFFFFF',
    paper: '#f6f8fa',
  },
  grey: {
    '500': '#d1d9e0',
  },
};

export const lightTheme: Theme = createTheme({
  ...layout,
  palette,
});
