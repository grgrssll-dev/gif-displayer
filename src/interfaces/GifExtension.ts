export default interface GifExtension {
    introduction: string;
    label: string;
    terminator: string;
}

export interface GifTextExtension extends GifExtension {
    text: string;
}

export interface GifApplicationExtension extends GifExtension {
    skip: number;
    subblock: number;
    loopCount: number;
    application: string;
}

export interface GifCommentExtension extends GifExtension {
    comment: string;
}