import React, { useState, ChangeEvent, DragEvent } from 'react';
import './FileTarget.css';
import GifData from '../../interfaces/GifData';
import GifDecoder from '../../lib/gif_decoder';
import { readFileToDataURI } from '../../utils';

const GIF_MIME = 'image/gif';

function stopEvent(e: DragEvent | ChangeEvent<HTMLInputElement>) {
    e.stopPropagation();
    e.preventDefault();
}

type FileStatus = 'none' | 'over' | 'dropped' | 'invalid';

type Props = {
    onGifData: (data: GifData) => void;
    onDataURI: (dataURI: string) => void;
    onDataError: (err: Error) => void;
};

export default function FileTarget(props: Props) {
    const { onGifData, onDataURI, onDataError } = props;
    const [fileStatus, setFileStatus] = useState<FileStatus>('none');

    const onDragEnter = (e: DragEvent) => {
        stopEvent(e);
        setFileStatus('over');
    };

    const onDragLeave = (e: DragEvent) => {
        stopEvent(e);
        setFileStatus('none');
    };

    const onDragOver = (e: DragEvent) => {
        stopEvent(e);
        setFileStatus('over');
    };

    const handleFile = (file: File) => {
        Promise.all([
            readFileToDataURI(file).then((dataURI: string) => {
                onDataURI(dataURI);
            }),
            GifDecoder.fromFileAsync(file).then((gif: any) => {
                gif.decode();
                onGifData(gif.toObject())
            })
        ]).catch((err: Error) => {
            onDataError(err);
        })
    }

    const onDrop = (e: DragEvent) => {
        stopEvent(e);
        const items = e.dataTransfer.items;
        const file = (items[0]?.kind === 'file') ? items[0]?.getAsFile() : null;
        if (file && file.type === GIF_MIME) {
            setFileStatus('dropped');
            handleFile(file);
        } else {
            console.error('Invalid Drop', items);
            setFileStatus('invalid');
        }
    };

    const onFile = (e: ChangeEvent<HTMLInputElement>) => {
        stopEvent(e);
        const file = e?.target?.files?.length ? e.target.files.item(0) : null;
        if (file && file.type === GIF_MIME) {
            setFileStatus('dropped');
            handleFile(file);
        } else {
            console.error('Invalid File', file);
            setFileStatus('invalid');
        }
    };

    return (
        <section className="file-target"
            data-file={fileStatus}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDrop}>
            <p>Drag and Drop a <strong>GIF</strong> here</p>
            <span>or</span>
            <div className="file-input">
                <label htmlFor="gif_input">Upload</label>
                <input type="file" id="gif_input" value="" onChange={onFile} />
            </div>
            {fileStatus === 'invalid' ? (
                <em>Invalid File</em>
            ) : null}
        </section>
    )
}