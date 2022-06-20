import type { FastAverageColorOptions } from '../index';
import { getOption } from './option';

const MIN_SIZE = 10;
const MAX_SIZE = 100;

export function isSvg(filename: string): boolean {
    return filename.search(/\.svg(\?|$)/i) !== -1;
}

export function getOriginalSize(resource: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas | ImageBitmap) {
    if (resource instanceof HTMLImageElement) {
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

    if (resource instanceof HTMLVideoElement) {
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
    if (resource instanceof HTMLCanvasElement) {
        return 'canvas';
    }

    if (resource instanceof OffscreenCanvas) {
        return 'offscreencanvas';
    }

    if (resource instanceof ImageBitmap) {
        return 'imagebitmap';
    }

    return resource.src;
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
    return isWebWorkers ?
        new OffscreenCanvas(1, 1) :
        document.createElement('canvas');
}

