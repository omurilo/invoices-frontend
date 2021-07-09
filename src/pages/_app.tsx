import "../../styles/globals.css";
import type { AppProps } from "next/app";
import {
  Box,
  Container,
  CssBaseline,
  MuiThemeProvider,
} from "@material-ui/core";
import theme from "../styles/theme";
import Navbar from "./components/Navbar";
import { useEffect } from "react";
import { SnackbarProvider } from "notistack";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    jssStyles?.parentElement?.removeChild(jssStyles);
  });

  return (
    <MuiThemeProvider theme={theme}>
      <SnackbarProvider>
        <CssBaseline />
        <Navbar />
        <Container>
          <Box marginTop={1}>
            <Component {...pageProps} />
          </Box>
        </Container>
      </SnackbarProvider>
    </MuiThemeProvider>
  );
}
export default MyApp;
