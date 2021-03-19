import { createMuiTheme } from "@material-ui/core";
import { green, red } from "@material-ui/core/colors";

const theme = createMuiTheme({
  palette: {
    primary: {
        main: "#79aec8",
        contrastText: "#fff",
      },
      secondary: {
        main: "#4db5ab",
        contrastText: "#fff",
        dark: "#055a52",
      },
      background: {
        default: "#fafafa",
      },
      error: {
        main: red["500"],
      },
      success: {
        main: green["500"],
        contrastText: "#fff",
      },
  },
  overrides: {
      MuiInputBase: {
          input: {
              
          }
      }
  }
});

export default theme;
