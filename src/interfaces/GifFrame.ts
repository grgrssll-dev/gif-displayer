import {
    GifTextExtension,
    GifApplicationExtension,
    GifCommentExtension
} from './GifExtension';
import GifOffsetGroup from './GifOffsetGroup';

export default interface GifFrame {
    graphicControlExtension: {
        introduction: string;
        label: string;
        byteSize: number;
        packed: {
            _binary: string;
            reserved: number;
            disposalMethod: number;
            userInputFlag: number;
            transparentColorFlag: number;
        },
        delayTime: number;
        transparentColorIndex: number;
        blockTerminator: number;
    },
    imageDescriptor: {
        imageSeparator: string;
        imageLeft: number;
        imageTop: number;
        width: number;
        height: number;
        packed: {
            _binary: string;
            localColorTableFlag: number;
            interlaceFlag: number;
            sortFlag: number;
            reserved: number;
            sizeOfLocalColorTable: number;
        },
    },
    localColorTable: string[];
    minCodeSize: number;
    compressedPixelData: number[];
    imageDataStream: number[];
    decodedPixels: string[];
    extensions: {
        text?: GifTextExtension;
        application?: GifApplicationExtension;
        comment?: GifCommentExtension;
    },
}


export interface GifFrameOffsets extends GifOffsetGroup {
    graphicControlExtension: {
        _start: number;
        introduction: number;
        label: number;
        byteSize: number;
        packed: number;
        delayTime: number;
        transparentColorIndex: number;
        blockTerminator: number;
        _end: number;
    },
    imageDescriptor: {
        _start: number;
        imageSeparator: number;
        imageLeft: number;
        imageTop: number;
        width: number;
        height: number;
        packed: number;
        _end: number;
    },
    localColorTable: GifOffsetGroup;
    minCodeSize: number;
    imageData: GifOffsetGroup;
    extensions: {
        text?: GifOffsetGroup;
        comment?: GifOffsetGroup;
        application?: GifOffsetGroup;
    }
}