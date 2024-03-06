import React, { useEffect, useRef, useState } from 'react';
import './Preview.css';
import GifFrame from '../../interfaces/GifFrame';
import IconButton from '@mui/material/IconButton';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

type Props = {
    frames: GifFrame[];
    width: number;
    height: number;
    bgColorIndex: number;
    globalBgColor: string;
};

export default function Preview(props: Props) {
    const { width, height, frames, bgColorIndex, globalBgColor } = props;
    const [currentFrame, setCurrentFrame] = useState(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                const frame = frames[currentFrame];
                const disposal = frame.graphicControlExtension.packed.disposalMethod;
                const transIndex = frame.graphicControlExtension.transparentColorIndex;
                const pixels = frame.decodedPixels;
                const { width: fW, height: fH, imageLeft: fL, imageTop: fT } = frame.imageDescriptor
                let px = 0;
                if (disposal === 0) {
                    // clear
                    ctx.clearRect(0, 0, width, height);
                } else if (disposal === 2) {
                    // fill with bg color
                    let bg = (transIndex === bgColorIndex) ? 'transparent' : globalBgColor;
                    if (frame.imageDescriptor.packed.localColorTableFlag) {
                        if (transIndex === bgColorIndex) {
                            bg = 'transparent';
                        } else {
                            bg = frame.localColorTable[bgColorIndex];
                        }
                    }
                    if (bg === 'transparent') {
                        ctx.clearRect(fL, fT, fW, fH);
                    } else {
                        ctx.fillStyle = bg;
                        ctx.fillRect(fL, fT, fW, fH);
                    }
                }
                for (let y = 0; y < fH; y++) {
                    for (let x = 0; x < fW; x++) {
                        ctx.fillStyle = pixels[px] || 'transparent';
                        ctx.fillRect(fL + x, fT + y, 1, 1);
                        px++;
                    }
                }
            }
        }

    }, [currentFrame]);

    const onNext = () => {
        setCurrentFrame((cf) => Math.min(cf + 1, frames.length - 1));
    };

    const onPrev = () => {
        setCurrentFrame((cf) => Math.max(cf - 1, 0));
    };

    return (
        <div className="gif-preview">
            <canvas ref={canvasRef} width={width} height={height}></canvas>
            <div className="gif-preview-controls">
                <IconButton disabled={currentFrame === 0} onClick={onPrev} title="Previous Frame">
                    <ArrowLeftIcon />
                </IconButton>
                <span className="gif-preview-position">
                    {`(${currentFrame + 1}/${frames.length})`}
                </span>
                <IconButton disabled={currentFrame === frames.length - 1} onClick={onNext} title="Next Frame">
                    <ArrowRightIcon />
                </IconButton>
            </div>
        </div>
    )
}