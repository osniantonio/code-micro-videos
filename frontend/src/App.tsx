//import logo from './logo.svg';
//import './App.css';
import React from "react";
import { Navbar } from "./components/Navbar";
import { Box, CssBaseline, MuiThemeProvider } from "@material-ui/core";
import AppRouter from "./routes/AppRouter";
import { BrowserRouter } from "react-router-dom";
import Breadcrumbs from "./components/Breadcrumbs";
import theme from "./theme";
import { SnackbarProvider } from "./components/SnackbarProvider";
import Spinner from "./components/Spinner";
import { LoadingProvider } from "./components/loading/LoadingProvider";

const App: React.FC = () => {
  return (
    <React.Fragment>
      <LoadingProvider>
        <MuiThemeProvider theme={theme}>
          <SnackbarProvider>
            <CssBaseline />
            <BrowserRouter basename="/admin">
              <Spinner />
              <Navbar />
              <Box paddingTop={"70px"}>
                <Breadcrumbs />
                <AppRouter />
              </Box>
            </BrowserRouter>
          </SnackbarProvider>
        </MuiThemeProvider>
      </LoadingProvider>
    </React.Fragment>
  );
};

export default App;
