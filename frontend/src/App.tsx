//import logo from './logo.svg';
//import './App.css';
import React from 'react';
import { Navbar } from './components/Navbar';
import { Box } from '@material-ui/core';
import AppRouter from './routes/AppRouter';
import { BrowserRouter } from 'react-router-dom';
import Breadcrumbs from './components/Breadcrumbs';

const App: React.FC = () => {
  return (
    <>
        <BrowserRouter>
            <Navbar/>
            <Box paddingTop={'70px'}>
                <Breadcrumbs/>
                <AppRouter/>
            </Box>
        </BrowserRouter>
    </>
  );
}

export default App;
