import type { FastAverageColorOptions, FastAverageColorResource } from '../index';
import { getOption } from './option';

const MIN_SIZE = 10;
const MAX_SIZE = 100;

export function isSvg(filename: string): boolean {
    return filename.search(/\.svg(\?|$)/i) !== -1;
}

export function getOriginalSize(resource: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas | ImageBitmap) {
    if (isInstanceOfHTMLImageElement(resource)) {
        let width = resource.naturalWidth;
        let height = resource.naturalHeight;

        // For SVG images with only viewBox attribute
        if (!resource.naturalWidth && isSvg(resource.src)) {
            width = height = MAX_SIZE;
        }

        return {
            width,
            height,
        };
    }

    if (isInstanceOfHTMLVideoElement(resource)) {
        return {
            width: resource.videoWidth,
            height: resource.videoHeight
        };
    }

    return {
        width: resource.width,
        height: resource.height
    };
}

export function getSrc(resource: HTMLCanvasElement | OffscreenCanvas | HTMLImageElement | HTMLVideoElement | ImageBitmap) {
    if (isInstanceOfHTMLCanvasElement(resource)) {
        return 'canvas';
    }

    if (isInstanceOfOffscreenCanvas(resource)) {
        return 'offscreencanvas';
    }

    if (isInstanceOfImageBitmap(resource)) {
        return 'imagebitmap';
    }

    return resource.src;
}

export function isInstanceOfHTMLImageElement(resource: FastAverageColorResource): resource is HTMLImageElement {
    return typeof HTMLImageElement !== 'undefined' && resource instanceof HTMLImageElement;
}

const hasOffscreenCanvas = typeof OffscreenCanvas !== 'undefined';

export function isInstanceOfOffscreenCanvas(resource: FastAverageColorResource): resource is OffscreenCanvas {
    return hasOffscreenCanvas && resource instanceof OffscreenCanvas;
}

export function isInstanceOfHTMLVideoElement(resource: FastAverageColorResource): resource is HTMLVideoElement {
    return typeof HTMLVideoElement !== 'undefined' && resource instanceof HTMLVideoElement;
}

export function isInstanceOfHTMLCanvasElement(resource: FastAverageColorResource): resource is HTMLCanvasElement {
    return typeof HTMLCanvasElement !== 'undefined' && resource instanceof HTMLCanvasElement;
}

export function isInstanceOfImageBitmap(resource: FastAverageColorResource): resource is ImageBitmap {
    return typeof ImageBitmap !== 'undefined' && resource instanceof ImageBitmap;
}

export function prepareSizeAndPosition(originalSize: { width: number; height: number; }, options: FastAverageColorOptions) {
    const srcLeft = getOption(options, 'left', 0);
    const srcTop = getOption(options, 'top', 0);
    const srcWidth = getOption(options, 'width', originalSize.width);
    const srcHeight = getOption(options, 'height', originalSize.height);

    let destWidth = srcWidth;
    let destHeight = srcHeight;

    if (options.mode === 'precision') {
        return {
            srcLeft,
            srcTop,
            srcWidth,
            srcHeight,
            destWidth,
            destHeight
        };
    }

    let factor;

    if (srcWidth > srcHeight) {
        factor = srcWidth / srcHeight;
        destWidth = MAX_SIZE;
        destHeight = Math.round(destWidth / factor);
    } else {
        factor = srcHeight / srcWidth;
        destHeight = MAX_SIZE;
        destWidth = Math.round(destHeight / factor);
    }

    if (
        destWidth > srcWidth || destHeight > srcHeight ||
        destWidth < MIN_SIZE || destHeight < MIN_SIZE
    ) {
        destWidth = srcWidth;
        destHeight = srcHeight;
    }

    return {
        srcLeft,
        srcTop,
        srcWidth,
        srcHeight,
        destWidth,
        destHeight
    };
}

const isWebWorkers = typeof window === 'undefined';

export function makeCanvas() {
    if (isWebWorkers) {
        return hasOffscreenCanvas ? new OffscreenCanvas(1, 1) : null;
    }

    return document.createElement('canvas');
}

