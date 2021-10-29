/// <reference types="offscreencanvas" />
import type { FastAverageColorOptions } from '../index';
export declare function isSvg(filename: string): boolean;
export declare function getOriginalSize(resource: HTMLCanvasElement | HTMLImageElement | HTMLVideoElement): {
    width: number;
    height: number;
};
export declare function getSrc(resource: HTMLCanvasElement | HTMLImageElement | HTMLVideoElement): string;
export declare function prepareSizeAndPosition(originalSize: {
    width: number;
    height: number;
}, options: FastAverageColorOptions): {
    srcLeft: number;
    srcTop: number;
    srcWidth: number;
    srcHeight: number;
    destWidth: number;
    destHeight: number;
};
export declare function makeCanvas(): HTMLCanvasElement | OffscreenCanvas;
