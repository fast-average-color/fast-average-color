import { dominantAlgorithm } from './algorithm/dominant';
import { simpleAlgorithm } from './algorithm/simple';
import { sqrtAlgorithm } from './algorithm/sqrt';

import { prepareColorData } from './helpers/color';
import { getDefaultColor } from './helpers/options';
import { makeCanvas, isImage, bindImageEvents } from './helpers/dom';
import { prepareSizeAndPosition, getResourceSize } from './helpers/size';
import { getError, outputError } from './helpers/error';

let canvas = null;
let ctx = null;

/**
 * Get asynchronously the average color from not loaded image.
 *
 * @param {HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | null} resource
 * @param {Object} [options]
 * @param {Array}  [options.defaultColor=[255, 255, 255, 255]]
 * @param {string} [options.mode="speed"] "precision" or "speed"
 * @param {string} [options.algorithm="sqrt"] "simple", "sqrt" or "dominant"
 * @param {number} [options.step=1]
 * @param {number} [options.left=0]
 * @param {number} [options.top=0]
 * @param {number} [options.width=width of resource]
 * @param {number} [options.height=height of resource]
 * @param {boolean} [options.silent] Disable error output via console.error
 *
 * @returns {Promise}
 */
export function getColor(resource, options) {
    if (resource) {
        if (isImage(resource) && !resource.complete) {
            return bindImageEvents(resource, options);
        }

        const result = getColor(resource, options);
        return result.error ? Promise.reject(result.error) : Promise.resolve(result);
    } else {
        return Promise.reject(getError('Call .getColorAsync(null) without resource.'));
    }
}

/**
 * Get the average color from images, videos and canvas.
 *
 * @param {HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | null} resource
 * @param {Object} [options]
 * @param {Array}  [options.defaultColor=[255, 255, 255, 255]]
 * @param {string} [options.mode="speed"] "precision" or "speed"
 * @param {string} [options.algorithm="sqrt"] "simple", "sqrt" or "dominant"
 * @param {number} [options.step=1]
 * @param {number} [options.left=0]
 * @param {number} [options.top=0]
 * @param {number} [options.width=width of resource]
 * @param {number} [options.height=height of resource]
 * @param {boolean} [options.silent] Disable error output via console.error
 *
 * @returns {Object}
 */
export function getColorSync(resource, options) {
    options = options || {};

    const defaultColor = getDefaultColor(options);

    let value = defaultColor;
    if (!resource) {
        outputError(options, 'call .getColor(null) without resource.');

        return prepareColorData(defaultColor);
    }

    const
        originalSize = getResourceSize(resource),
        size = prepareSizeAndPosition(originalSize, options);

    if (!size.srcWidth || !size.srcHeight || !size.destWidth || !size.destHeight) {
        outputError(options, `incorrect sizes for resource "${resource.src}".`);

        return prepareColorData(defaultColor);
    }

    if (!ctx) {
        canvas = makeCanvas();
        ctx = canvas.getContext && canvas.getContext('2d');

        if (!ctx) {
            outputError(options, 'Canvas Context 2D is not supported in this browser.');

            return prepareColorData(defaultColor);
        }
    }

    canvas.width = size.destWidth;
    canvas.height = size.destHeight;

    try {
        ctx.clearRect(0, 0, size.destWidth, size.destHeight);
        ctx.drawImage(
            resource,
            size.srcLeft, size.srcTop,
            size.srcWidth, size.srcHeight,
            0, 0,
            size.destWidth, size.destHeight
        );

        const bitmapData = ctx.getImageData(0, 0, size.destWidth, size.destHeight).data;
        value = getColorFromArray4(bitmapData, options);
    } catch (e) {
        outputError(options, `security error (CORS) for resource ${resource.src}.\nDetails: https://developer.mozilla.org/en/docs/Web/HTML/CORS_enabled_image`, e);
    }

    return prepareColorData(value);
}

/**
 * Get the average color from a array when 1 pixel is 4 bytes.
 *
 * @param {Array|Uint8Array} arr
 * @param {Object} [options]
 * @param {string} [options.algorithm="sqrt"] "simple", "sqrt" or "dominant"
 * @param {Array}  [options.defaultColor=[255, 255, 255, 255]]
 * @param {number} [options.step=1]
 *
 * @returns {Array} [red (0-255), green (0-255), blue (0-255), alpha (0-255)]
 */
export function getColorFromArray4(arr, options) {
    options = options || {};

    const
        bytesPerPixel = 4,
        arrLength = arr.length;

    if (arrLength < bytesPerPixel) {
        return getDefaultColor(options);
    }

    const
        len = arrLength - arrLength % bytesPerPixel,
        preparedStep = (options.step || 1) * bytesPerPixel;

    let algorithm;

    switch (options.algorithm || 'sqrt') {
        case 'simple':
            algorithm = simpleAlgorithm;
            break;
        case 'sqrt':
            algorithm = sqrtAlgorithm;
            break;
        case 'dominant':
            algorithm = dominantAlgorithm;
            break;
        default:
            throw getError(`${options.algorithm} is unknown algorithm.`);
    }

    return algorithm(arr, len, preparedStep);
}

export function removeCanvas() {
    canvas = null;
    ctx = null;
}
