import { dominantAlgorithm } from './algorithm/dominant';
import { simpleAlgorithm } from './algorithm/simple';
import { sqrtAlgorithm } from './algorithm/sqrt';

import { arrayToHex, isDark, prepareIgnoredColor } from './helpers/color';
import { getDefaultColor } from './helpers/option';
import { prepareSizeAndPosition, makeCanvas, getOriginalSize, getSrc } from './helpers/dom';
import { outputError, getError } from './helpers/error';

export type FastAverageColorRgb = [number, number, number];
export type FastAverageColorRgba = [number, number, number, number];
export type FastAverageColorRgbaWithThreshold = [number, number, number, number, number];

export type FastAverageColorIgnoredColor = FastAverageColorRgb | FastAverageColorRgba | FastAverageColorRgbaWithThreshold | Array<FastAverageColorRgb | FastAverageColorRgba | FastAverageColorRgbaWithThreshold>;

export interface FastAverageColorOptions {
    defaultColor?: FastAverageColorRgba;
    ignoredColor?: FastAverageColorIgnoredColor;
    mode?: 'precision' | 'speed';
    algorithm?: 'simple' | 'sqrt' | 'dominant';
    step?: number;
    left?: number;
    top?: number;
    width?: number;
    height?: number;
    silent?: boolean;
}

export interface FastAverageColorAlgorithmOptions {
    defaultColor: FastAverageColorRgba;
    ignoredColor: Array<FastAverageColorRgb | FastAverageColorRgba | FastAverageColorRgbaWithThreshold>;
    step: number;
}

type FastAverageColorResource = string | HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | null;

export interface FastAverageColorResult {
    rgb: string;
    rgba: string;
    hex: string;
    hexa: string;
    value: FastAverageColorRgba;
    isDark: boolean;
    isLight: boolean;
    error?: Error;
}

export default class FastAverageColor {
    canvas: HTMLCanvasElement | OffscreenCanvas | null = null;
    ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null = null;

    /**
     * Get asynchronously the average color from not loaded image.
     */
    public getColorAsync(resource: FastAverageColorResource, options?: FastAverageColorOptions): Promise<FastAverageColorResult> {
        if (!resource) {
            return Promise.reject(getError('call .getColorAsync() without resource.'));
        }

        if (typeof resource === 'string') {
            const img = new Image();
            img.crossOrigin = '';
            img.src = resource;

            return this.bindImageEvents(img, options);
        } else if (resource instanceof Image && !resource.complete) {
            return this.bindImageEvents(resource, options);
        } else {
            const result = this.getColor(resource, options);

            return result.error ? Promise.reject(result.error) : Promise.resolve(result);
        }
    }

    /**
     * Get the average color from images, videos and canvas.
     */
    public getColor(resource: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | null, options?: FastAverageColorOptions): FastAverageColorResult {
        options = options || {};

        const defaultColor = getDefaultColor(options);

        if (!resource) {
            outputError('call .getColor(null) without resource.', options.silent);

            return this.prepareResult(defaultColor);
        }

        const originalSize = getOriginalSize(resource);
        const size = prepareSizeAndPosition(originalSize, options);

        if (!size.srcWidth || !size.srcHeight || !size.destWidth || !size.destHeight) {
            outputError(`incorrect sizes for resource "${getSrc(resource)}".`, options.silent);

            return this.prepareResult(defaultColor);
        }

        if (!this.canvas) {
            this.canvas = makeCanvas();
        }

        if (!this.ctx) {
            this.ctx = this.canvas.getContext && this.canvas.getContext('2d');

            if (!this.ctx) {
                outputError('Canvas Context 2D is not supported in this browser.', options.silent);

                return this.prepareResult(defaultColor);
            }
        }

        this.canvas.width = size.destWidth;
        this.canvas.height = size.destHeight;

        let value = defaultColor;

        try {
            this.ctx.clearRect(0, 0, size.destWidth, size.destHeight);
            this.ctx.drawImage(
                resource,
                size.srcLeft, size.srcTop,
                size.srcWidth, size.srcHeight,
                0, 0,
                size.destWidth, size.destHeight
            );

            const bitmapData = this.ctx.getImageData(0, 0, size.destWidth, size.destHeight).data;
            value = this.getColorFromArray4(bitmapData, options);
        } catch (e) {
            outputError(`security error (CORS) for resource ${getSrc(resource)}.\nDetails: https://developer.mozilla.org/en/docs/Web/HTML/CORS_enabled_image`, options.silent, e);
        }

        return this.prepareResult(value);
    }

    /**
     * Get the average color from a array when 1 pixel is 4 bytes.
     */
    public getColorFromArray4(arr: number[]|Uint8Array|Uint8ClampedArray, options?: FastAverageColorOptions): FastAverageColorRgba {
        options = options || {};

        const bytesPerPixel = 4;
        const arrLength = arr.length;
        const defaultColor = getDefaultColor(options);

        if (arrLength < bytesPerPixel) {
            return defaultColor;
        }

        const len = arrLength - arrLength % bytesPerPixel;
        const step = (options.step || 1) * bytesPerPixel;

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

        return algorithm(arr, len, {
            defaultColor,
            ignoredColor: prepareIgnoredColor(options.ignoredColor),
            step
        });
    }

    /**
     * Get color data from value ([r, g, b, a]).
     */
    public prepareResult(value: number[]): FastAverageColorResult {
        const rgb = value.slice(0, 3);
        const rgba = [value[0], value[1], value[2], value[3] / 255];
        const isDarkColor = isDark(value);

        return {
            value: [value[0], value[1], value[2], value[3]],
            rgb: 'rgb(' + rgb.join(',') + ')',
            rgba: 'rgba(' + rgba.join(',') + ')',
            hex: arrayToHex(rgb),
            hexa: arrayToHex(value),
            isDark: isDarkColor,
            isLight: !isDarkColor
        };
    }

    /**
     * Destroy the instance.
     */
    public destroy() {
        this.canvas = null;
        this.ctx = null;
    }

    private bindImageEvents(resource: HTMLImageElement, options?: FastAverageColorOptions): Promise<FastAverageColorResult> {
        return new Promise((resolve, reject) => {
            const onload = () => {
                unbindEvents();

                const result = this.getColor(resource, options);

                if (result.error) {
                    reject(result.error);
                } else {
                    resolve(result);
                }
            };

            const onerror = () => {
                unbindEvents();

                reject(getError(`Error loading image "${resource.src}".`));
            };

            const onabort = () => {
                unbindEvents();

                reject(getError(`Image "${resource.src}" loading aborted.`));
            };

            const unbindEvents = () => {
                resource.removeEventListener('load', onload);
                resource.removeEventListener('error', onerror);
                resource.removeEventListener('abort', onabort);
            };

            resource.addEventListener('load', onload);
            resource.addEventListener('error', onerror);
            resource.addEventListener('abort', onabort);
        });
    }
}
