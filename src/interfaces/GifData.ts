import GifFrame from './GifFrame';
import {
    GifTextExtension,
    GifApplicationExtension,
    GifCommentExtension
} from './GifExtension';
import GifOffsetGroup from './GifOffsetGroup';

export default interface GifData {
    _byteSize: number;
    header: {
        signature: string;
        version: string;
    },
    logicalScreenDescriptor: {
        width: number;
        height: number;
        packed: {
            _binary: string;
            globalColorTableFlag: number;
            colorResolution: number;
            sortFlag: number;
            sizeOfGlobalColorTable: number;
        },
        backgroundColorIndex: number;
        pixelAspectRatio: number;
    },
    globalColorTable: string[];
    frames: GifFrame[];
    extensions: {
        text?: GifTextExtension;
        application?: GifApplicationExtension;
        comment?: GifCommentExtension;
    },
    tailer: string;
}

export interface GifDataOffsets extends GifOffsetGroup {
    header: {
        _start: number;
        signature: number;
        version: number;
        _end: number;
    },
    logicalScreenDescriptor: {
        _start: number;
        width: number;
        height: number;
        packed: number;
        backgroundColorIndex: number;
        pixelAspectRatio: number;
        _end: number;
    },
    globalColorTable: GifOffsetGroup;
    extensions: {
        graphicControl: GifOffsetGroup[];
        text?: GifOffsetGroup;
        comment?: GifOffsetGroup;
        application?: GifOffsetGroup;
    },
}