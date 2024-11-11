import { Components } from '@mui/material';

export const MuiAccordionSummary: Components['MuiAccordionSummary'] = {
  styleOverrides: {
    root: ({ theme }: any) => ({
      backgroundColor: theme.palette.background.paper,
      flexDirection: 'row-reverse',
      '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
      },
      '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
      },
    }),
  },
};
