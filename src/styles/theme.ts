import { red } from "@material-ui/core/colors";
import { createTheme } from "@material-ui/core/styles";
import { PaletteOptions } from "@material-ui/core/styles/createPalette";

const palette: PaletteOptions = {
  type: "dark",
  primary: {
    main: red[800],
    contrastText: "#FFFFFF",
  },
  background: {
    default: "#242526",
  },
};

const theme = createTheme({
  palette,
});

export default theme;
