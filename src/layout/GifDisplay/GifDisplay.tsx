import React, { useState } from 'react';
import './GifDisplay.css';
import GifData from '../../interfaces/GifData';
import { formatFileSize } from '../../utils';
import ImageStat from '../ImageStat';
import Preview from '../Preview';
import Frame from '../Frame';
import Extension from '../Extension';

type Props = {
    gif: GifData;
    imageDataURI: string;
};

export default function GifDisplay(props: Props) {
    const { gif, imageDataURI } = props;
    const [currentFrame, setCurrentFrame] = useState<number>(0);
    console.log('GIF', gif);
    const header = `${gif.header.signature}${gif.header.version}`;
    const lsd = gif?.logicalScreenDescriptor;
    const { size: fileSize, unit } = formatFileSize(gif._byteSize);
    const { width, height } = lsd;

    const onFrameChange = (f: number) => {
        setCurrentFrame(f);
    };
    return (
        <section className="gif-display column">
            <header className="gif-section row">
                <div className="cell-full">
                    <h2>Preview</h2>
                </div>
                <div className="cell">
                    <img src={imageDataURI} alt="missing" className="gif-image" />
                    <p className="meta">Filesize: {fileSize}{unit}</p>
                    <p className="meta">Dimensions: {width}x{height}</p>
                    <p className="meta">Frames: {gif.frames.length}</p>
                </div>
                <div className="cell">
                    <Preview
                        frames={gif.frames}
                        width={width}
                        height={height}
                        bgColorIndex={lsd.backgroundColorIndex}
                        globalBgColor={gif.globalColorTable ? gif.globalColorTable[lsd.backgroundColorIndex] : 'transparent'} />
                </div>
                <div className="cell">
                    <h3>Header</h3>
                    <ImageStat
                        label="Signature"
                        value={gif.header.signature} />
                    <ImageStat
                        label="Version"
                        value={gif.header.version} />
                </div>
                <div className="cell">
                    <h3>Logical Screen Descriptor</h3>
                    <ImageStat
                        label="Width"
                        value={width} />
                    <ImageStat
                        label="Height"
                        value={height} />
                    <ImageStat
                        label="Packed Bits"
                        value={lsd.packed._binary} />
                    <ImageStat
                        label=" — Global Color Table Flag"
                        value={lsd.packed.globalColorTableFlag} />
                    <ImageStat
                        label=" — Color Resolution"
                        value={lsd.packed.colorResolution} />
                    <ImageStat
                        label=" — Sort Flag"
                        value={lsd.packed.sortFlag} />
                    <ImageStat
                        label=" — Size of Global Color Table"
                        value={lsd.packed.sizeOfGlobalColorTable} />
                    <ImageStat
                        label="Background Color Index"
                        value={lsd.backgroundColorIndex} />
                    <ImageStat
                        label="Pixel Aspect Ratio"
                        value={lsd.pixelAspectRatio} />
                </div>
            </header>
            <div className="gif-section row">
                <div className="cell-full">
                    <h2>Frames <small>({gif.frames.length})</small></h2>
                </div>
                <div className="cell-full">
                    <div className="gif-frames-navigation">
                        {gif.frames.map((f, i) => (
                            <a onClick={() => onFrameChange(i)}
                                className={i === currentFrame ? 'active' : ''}
                                key={i}>{i + 1}</a>
                        ))}
                    </div>
                </div>
                <div className="cell-full">
                    <div className="gif-frames-wrapper">
                        <div className="gif-frames-inner"
                            style={{
                                width: gif.frames.length * window.innerWidth * 0.9,
                                transform: `translateX(-${currentFrame * window.innerWidth * 0.9}px)`
                            }}>
                            {gif.frames.map((f, i) => (
                                <Frame key={i}
                                    frame={f}
                                    index={i}
                                    width={width}
                                    height={height}
                                    bgColorIndex={lsd.backgroundColorIndex}
                                    globalBgColor={gif.globalColorTable ? gif.globalColorTable[lsd.backgroundColorIndex] : 'transparent'} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {gif.globalColorTable.length && lsd.packed.globalColorTableFlag ? (
                <div className="gif-section row">
                    <div className="cell-full">
                        <h2>Global Color Table <small>({gif.globalColorTable.length} colors)</small></h2>
                    </div>
                    <div className="frame-color-table cell-full">
                        {gif.globalColorTable.map((c, i) => (
                            <span style={{ backgroundColor: `${c}` }}
                                title={`${c}`}
                                data-color={`${c}`}
                                key={i}></span>
                        ))}
                    </div>
                </div>
            ) : null}
            <div className="gif-section row">
                <div className="cell-full">
                    <h2>Extensions</h2>
                </div>
                <div className="cell-full">
                    {gif.extensions.application?.introduction ? (
                        <Extension type="application" data={gif.extensions.application} />
                    ) : null}
                    {gif.extensions.text?.introduction ? (
                        <Extension type="text" data={gif.extensions.text} />
                    ) : null}
                    {gif.extensions.comment?.introduction ? (
                        <Extension type="comment" data={gif.extensions.comment} />
                    ) : null}
                    {gif.frames.map((frame => (
                        <>
                            {frame.extensions.application?.introduction ? (
                                <Extension type="application" data={frame.extensions.application} />
                            ) : null}
                            {frame.extensions.text?.introduction ? (
                                <Extension type="text" data={frame.extensions.text} />
                            ) : null}
                            {frame.extensions.comment?.introduction ? (
                                <Extension type="comment" data={frame.extensions.comment} />
                            ) : null}
                        </>
                    )))}
                </div>
            </div>
        </section>
    )
}