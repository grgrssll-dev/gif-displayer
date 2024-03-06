import React from 'react';
import './Header.css';
import Button from '@mui/material/Button';
import GifData from '../../interfaces/GifData';


type Props = {
    showReset: boolean;
    onClearGif: () => void;
};

export default function Header(props: Props) {
    const { showReset, onClearGif } = props;
    return (
        <header className="header">
            <h1>GIF Decoder</h1>
            {showReset ? (
                <Button
                    onClick={onClearGif}
                    variant="outlined"
                    color="info">Reset</Button>
            ) : null}
        </header>
    )
}