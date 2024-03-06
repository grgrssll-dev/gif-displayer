import React, { useRef, useEffect } from 'react';
import './Frame.css';
import GifFrame from '../../interfaces/GifFrame';
import ImageStat from '../ImageStat';
import GifDecoder from '../../lib/gif_decoder';

type Props = {
    frame: GifFrame,
    index: number;
    width: number;
    height: number;
    bgColorIndex: number;
    globalBgColor: string;
};

const disposalMethods = GifDecoder.getDisposalMethodLabels();

export default function Frame(props: Props) {
    const { frame, index, width, height, bgColorIndex, globalBgColor } = props;
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
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
    }, []);

    const { graphicControlExtension: gce, imageDescriptor: id } = frame;

    return (
        <div className="gif-frame">
            <div className="gif-frame-inner column">
                <h3 className="gif-frame-number">Frame {index + 1}</h3>
                <div className="row">
                    <div className="cell-full">
                        <canvas ref={canvasRef} width={width} height={height}></canvas>
                    </div>
                    <div className="cell">
                        <h3>Graphic Control Extension</h3>
                        <ImageStat
                            label="Introduction"
                            value={gce.introduction} />
                        <ImageStat
                            label="Label"
                            value={gce.label} />
                        <ImageStat
                            label="Byte Size"
                            value={gce.byteSize} />
                        <ImageStat
                            label="Packed Bits"
                            value={gce.packed._binary} />
                        <ImageStat
                            label=" — Reserved"
                            value={gce.packed.reserved} />
                        <ImageStat
                            label=" — Disposal Method"
                            value={gce.packed.reserved}
                            suffix={disposalMethods[gce.packed.disposalMethod]} />
                        <ImageStat
                            label=" — User Input Flag"
                            value={gce.packed.userInputFlag} />
                        <ImageStat
                            label=" — Transparent Color Flag"
                            value={gce.packed.transparentColorFlag} />
                        <ImageStat
                            label="Delay Time"
                            value={gce.delayTime}
                            suffix="ms" />
                        <ImageStat
                            label="Transparent Color Index"
                            value={gce.transparentColorIndex} />
                    </div>
                    <div className="cell">
                        <h3>Image Descriptor</h3>
                        <ImageStat
                            label="Image Separator"
                            value={id.imageSeparator} />
                        <ImageStat
                            label="Image Left Offset"
                            value={id.imageLeft} />
                        <ImageStat
                            label="Image Top Offset"
                            value={id.imageTop} />
                        <ImageStat
                            label="Frame Width"
                            value={id.width} />
                        <ImageStat
                            label="Frame Height"
                            value={id.height} />
                        <ImageStat
                            label="Packed Bits"
                            value={id.packed._binary} />
                        <ImageStat
                            label=" — Local Color Table Flag"
                            value={id.packed.localColorTableFlag} />
                        <ImageStat
                            label=" — Interlace Flag"
                            value={id.packed.interlaceFlag} />
                        <ImageStat
                            label=" — Sort Flag"
                            value={id.packed.sortFlag} />
                        <ImageStat
                            label=" — Reserved"
                            value={id.packed.reserved} />
                        <ImageStat
                            label=" — Size of Local Color Table"
                            value={id.packed.sizeOfLocalColorTable} />
                    </div>
                    <div className="cell-full">
                        <h3>Local Color Table <small>({frame.localColorTable.length} colors)</small></h3>
                        {id.packed.localColorTableFlag && frame.localColorTable.length ? (
                            <div className="cell-ful frame-color-table">
                                {frame.localColorTable.map((c, i) => (
                                    <span style={{ backgroundColor: `${c}` }}
                                        title={`${c}`}
                                        data-color={`${c}`}
                                        key={i}></span>
                                ))}
                            </div>
                        ) : (
                            <p className="missing-value">No Local Color Table. See Global Color Table Below</p>
                        )}
                    </div>
                    <div className="cell-full">
                        <h3>Image Data</h3>
                    </div>
                    <div className="cell-full">
                        <ImageStat
                            label="Min Code Size"
                            value={frame.minCodeSize} />
                        <ImageStat
                            label="Compressed Image Hex"
                            value="" />
                        <p className="hex">
                            {frame.compressedPixelData.map((p) => (
                                p.toString(16).toUpperCase().padStart(2, '0')
                            )).join(' ')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}