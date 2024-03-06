import React, { useCallback, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './layout/Header';
import FileTarget from './layout/FileTarget';
import GifDisplay from './layout/GifDisplay';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import GifData from './interfaces/GifData';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            light: '#092',
            main: '#092',
            dark: '#092',
            contrastText: '#000',
        },
        secondary: {
            light: '#06f',
            main: '#06f',
            dark: '#06f',
            contrastText: '#00f',
        },
        success: {
            light: '#0f2',
            main: '#0f2',
            dark: '#0f2',
            contrastText: '#0f0',
        },
        error: {
            light: '#f20',
            main: '#f20',
            dark: '#f20',
            contrastText: '#f00',
        },
        info: {
            light: "#ddd",
            main: "#ddd",
            dark: "#ddd",
            contrastText: "#0cf",
        }
    },
});

function App() {
    const [gifData, setGifData] = useState<GifData | null>(null);
    const [imageDataURI, setImageDataURI] = useState<string | null>(null);
    const [dataError, setDataError] = useState<Error | null>(null);

    const onClearGif = () => {
        setGifData(null);
        setImageDataURI(null);
        setDataError(null);
    };

    const onData = (data: GifData) => {
        setGifData(data);
    };

    const onDataURI = (dataURI: string) => {
        setImageDataURI(dataURI);
    };

    const onDataError = (err: Error) => {
        setDataError(err);
    }

    const showReset = (!!gifData && !!imageDataURI) || !!dataError;

    return (
        <ThemeProvider theme={theme}>
            <Header showReset={showReset} onClearGif={onClearGif} />
            <main data-status={gifData ? 'loaded' : 'waiting'}>
                {(gifData && imageDataURI && !dataError) ? (
                    <GifDisplay gif={gifData} imageDataURI={imageDataURI} />
                ) : (
                    <FileTarget onGifData={onData} onDataURI={onDataURI} onDataError={onDataError} />
                )}
                {dataError ? (
                    <>
                        <h2>Error</h2>
                        <p>{dataError.message}</p>
                    </>
                ) : null}
            </main>
            <CssBaseline />
        </ThemeProvider>
    );
}

export default App;
