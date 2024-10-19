import { PaletteColor, PaletteColorOptions } from '@mui/material';

declare module '@mui/material' {
  interface Palette {
    default: PaletteColor;
    inherit: PaletteColor;
    disabled: PaletteColor;
  }
  interface PaletteOptions {
    default?: PaletteColorOptions;
    inherit?: PaletteColorOptions;
    disabled?: PaletteColorOptions;
  }

  interface TextFieldPropsColorOverrides
    extends Record<
      | 'primary'
      | 'secondary'
      | 'error'
      | 'info'
      | 'success'
      | 'warning'
      | 'default'
      | 'inherit'
      | 'disabled',
      true
    > {}
}
