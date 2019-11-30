import { getOption } from './options';

export function getResourceSize(resource) {
    if (resource instanceof HTMLImageElement) {
        return {
            width: resource.naturalWidth,
            height: resource.naturalHeight
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

export function prepareSizeAndPosition(originalSize, options) {
    let
        srcLeft = getOption(options, 'left', 0),
        srcTop = getOption(options, 'top', 0),
        srcWidth = getOption(options, 'width', originalSize.width),
        srcHeight = getOption(options, 'height', originalSize.height),
        destWidth = srcWidth,
        destHeight = srcHeight;

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

    const
        maxSize = 100,
        minSize = 10;

    let factor;

    if (srcWidth > srcHeight) {
        factor = srcWidth / srcHeight;
        destWidth = maxSize;
        destHeight = Math.round(destWidth / factor);
    } else {
        factor = srcHeight / srcWidth;
        destHeight = maxSize;
        destWidth = Math.round(destHeight / factor);
    }

    if (
        destWidth > srcWidth || destHeight > srcHeight ||
        destWidth < minSize || destHeight < minSize
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
