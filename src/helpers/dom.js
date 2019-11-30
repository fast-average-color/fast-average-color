import { getColor } from './helpers/color';
import { getError } from './helpers/error';

export function makeCanvas() {
    return typeof window === 'undefined' ?
        new OffscreenCanvas(1, 1) :
        document.createElement('canvas');
}

export function isImage(resource) {
    return typeof HTMLImageElement !== 'undefined' &&
        resource instanceof HTMLImageElement;
}

export function bindImageEvents(resource, options) {
    return new Promise((resolve, reject) => {
        const onload = () => {
                unbindEvents();

                const result = getColor(resource, options);

                if (result.error) {
                    reject(result.error);
                } else {
                    resolve(result);
                }
            },
            onerror = () => {
                unbindEvents();

                reject(getError(`Error loading image ${resource.src}.`));
            },
            onabort = () => {
                unbindEvents();

                reject(getError(`Image "${resource.src}" loading aborted.`));
            },
            unbindEvents = () => {
                resource.removeEventListener('load', onload);
                resource.removeEventListener('error', onerror);
                resource.removeEventListener('abort', onabort);
            };

        resource.addEventListener('load', onload);
        resource.addEventListener('error', onerror);
        resource.addEventListener('abort', onabort);
    });
}
