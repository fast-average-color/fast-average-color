export function getOriginalSize(resource) {
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

export function makeCanvas() {
    return typeof window === 'undefined' ?
        new OffscreenCanvas(1, 1) :
        document.createElement('canvas');
}

