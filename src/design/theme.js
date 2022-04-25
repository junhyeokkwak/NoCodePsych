import { createTheme, responsiveFontSizes } from "@mui/material/styles";

let theme = createTheme({
  palette: {
    // primary: {
    //   light: "#80FFDB",
    //   main: "#80FFDB",
    //   dark: "#80FFDB",
    //   contrastText: "#000",
    // },
    // secondary: {
    //   light: "#FAB3A9",
    //   main: "#AB4967",
    //   dark: "#AB4967",
    //   contrastText: "#000",
    // },
  },
});

theme = responsiveFontSizes(theme);

export default theme;
