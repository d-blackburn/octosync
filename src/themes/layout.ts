import { ThemeOptions } from '@mui/material';
import shape from './styles/layout.module.scss';
import { MuiInputBase } from './components/MuiInputBase';
import { MuiInputLabel } from './components/MuiInputLabel';
import { MuiButton } from './components/MuiButton';
import { MuiTextField } from './components/MuiTextField';

export const layout: ThemeOptions = {
  components: {
    MuiInputBase,
    MuiInputLabel,
    MuiButton,
    MuiTextField,
  },
  typography: {
    fontFamily: shape.font,
  },
  shape: {
    borderRadius: parseInt(shape.borderRadius, 10),
  },
};
