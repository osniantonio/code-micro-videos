//import logo from './logo.svg';
//import './App.css';
import React from 'react';
import { Navbar } from './components/Navbar';
import { Box, CssBaseline, MuiThemeProvider } from '@material-ui/core';
import AppRouter from './routes/AppRouter';
import { BrowserRouter } from 'react-router-dom';
import Breadcrumbs from './components/Breadcrumbs';
import theme from './theme';

const App: React.FC = () => {
  return (
    <React.Fragment>
     <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
            <Navbar/>
            <Box paddingTop={'70px'}>
                <Breadcrumbs/>
                <AppRouter/>
            </Box>
        </BrowserRouter>
      </MuiThemeProvider>
      </React.Fragment>
  );
}

export default App;
