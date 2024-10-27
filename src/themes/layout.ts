import { ThemeOptions } from '@mui/material';
import shape from './styles/layout.module.scss';
import { MuiInputBase } from './components/MuiInputBase';
import { MuiInputLabel } from './components/MuiInputLabel';
import { MuiButton } from './components/MuiButton';
import { MuiTextField } from './components/MuiTextField';
import { MuiPaper } from './components/MuiPaper';
import { MuiAppBar } from './components/MuiAppBar';
import { MuiIconButton } from './components/MuiIconButton';
import { MuiMenu } from './components/MuiMenu';
import { MuiContainer } from './components/MuiContainer';
import { MuiCard } from './components/MuiCard';

export const layout: ThemeOptions = {
  components: {
    MuiInputBase,
    MuiInputLabel,
    MuiButton,
    MuiTextField,
    MuiPaper,
    MuiCard,
    MuiAppBar,
    MuiIconButton,
    MuiMenu,
    MuiContainer,
  },
  typography: {
    fontFamily: shape.font,
    h1: {
      fontSize: 40,
      fontWeight: 'bold',
    },
    h2: {
      fontSize: 35,
    },
    h3: {
      fontSize: 30,
      fontWeight: 'bold',
    },
    h4: {
      fontSize: 30,
    },
    h5: {
      fontSize: 25,
    },
    h6: {
      fontSize: 16,
      fontWeight: 'bold',
    },
  },
  shape: {
    borderRadius: parseInt(shape.borderRadius, 10),
  },
};
