import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme();

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});



createTheme({
    components: {
      MuiButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            // use JavaScript conditional expression
            color: theme.palette.mode === 'dark' ? '#fff' : theme.palette.primary.main,
          }),
        },
      },
    },
  });