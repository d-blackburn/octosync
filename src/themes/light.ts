import { createTheme, PaletteOptions, Theme } from '@mui/material';
import { layout } from './layout';

const palette: PaletteOptions = {
  default: {
    dark: 'rgb(31, 35, 40)',
    main: 'rgb(31, 35, 40)',
    light: 'rgb(232,232,232)',
    contrastText: 'rgb(31, 35, 40)',
  },
};

export const lightTheme: Theme = createTheme({
  ...layout,
  palette,
});
