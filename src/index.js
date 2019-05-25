import dominantAlgorithm from './algorithm/dominant';
import simpleAlgorithm from './algorithm/simple';
import sqrtAlgorithm from './algorithm/sqrt';

const ERROR_PREFIX = 'FastAverageColor: ';

export default class FastAverageColor {
    /**
     * Get asynchronously the average color from not loaded image.
     *
     * @param {HTMLImageElement | null} resource
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
    getColorAsync(resource, options) {
        if (!resource) {
            return Promise.reject(Error('Call .getColorAsync(null) without resource.'));
        } else if (resource.complete) {
            const result = this.getColor(resource, options);
            return result.error ? Promise.reject(result.error) : Promise.resolve(result);
        } else {
            return this._bindImageEvents(resource, options);
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
    getColor(resource, options) {
        options = options || {};

        const defaultColor = this._getDefaultColor(options);

        let value = defaultColor;
        if (!resource) {
            this._outputError(options, 'call .getColor(null) without resource.');

            return this._prepareResult(defaultColor);
        }

        const 
            originalSize = this._getOriginalSize(resource),
            size = this._prepareSizeAndPosition(originalSize, options);

        if (!size.srcWidth || !size.srcHeight || !size.destWidth || !size.destHeight) {
            this._outputError(options, `incorrect sizes for resource "${resource.src}".`);

            return this._prepareResult(defaultColor);
        }

        if (!this._ctx) {
            this._canvas = this._makeCanvas();
            this._ctx = this._canvas.getContext && this._canvas.getContext('2d');

            if (!this._ctx) {
                this._outputError(options, 'Canvas Context 2D is not supported in this browser.');

                return this._prepareResult(defaultColor);
            }
        }

        this._canvas.width = size.destWidth;
        this._canvas.height = size.destHeight;

        try {
            this._ctx.clearRect(0, 0, size.destWidth, size.destHeight);
            this._ctx.drawImage(
                resource,
                size.srcLeft, size.srcTop,
                size.srcWidth, size.srcHeight,
                0, 0,
                size.destWidth, size.destHeight
            );

            const bitmapData = this._ctx.getImageData(0, 0, size.destWidth, size.destHeight).data;
            value = this.getColorFromArray4(bitmapData, options);
        } catch (e) {
            this._outputError(options, `security error (CORS) for resource ${resource.src}.\nDetails: https://developer.mozilla.org/en/docs/Web/HTML/CORS_enabled_image`, e);
        }

        return this._prepareResult(value);
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
    getColorFromArray4(arr, options) {
        options = options || {};

        const
            bytesPerPixel = 4,
            arrLength = arr.length;

        if (arrLength < bytesPerPixel) {
            return this._getDefaultColor(options);
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
                throw new Error(`${ERROR_PREFIX}${options.algorithm} is unknown algorithm.`);
        }

        return algorithm(arr, len, preparedStep);
    }

    /**
     * Destroy the instance.
     */
    destroy() {
        delete this._canvas;
        delete this._ctx;
    }

    _getDefaultColor(options) {
        return this._getOption(options, 'defaultColor', [255, 255, 255, 255]);
    }

    _getOption(options, name, defaultValue) {
        return typeof options[name] === 'undefined' ? defaultValue : options[name];
    }

    _prepareSizeAndPosition(originalSize, options) {
        let
            srcLeft = this._getOption(options, 'left', 0),
            srcTop = this._getOption(options, 'top', 0),
            srcWidth = this._getOption(options, 'width', originalSize.width),
            srcHeight = this._getOption(options, 'height', originalSize.height),
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

    _bindImageEvents(resource, options) {
        return new Promise((resolve, reject) => {
            const onload = () => {
                    unbindEvents();

                    const result = this.getColor(resource, options);

                    if (result.error) {
                        reject(result.error);
                    } else {
                        resolve(result);
                    }
                
                },
                onerror = () => {
                    unbindEvents();

                    reject(new Error(`${ERROR_PREFIX}Error loading image ${resource.src}.`));
                },
                onabort = () => {
                    unbindEvents();

                    reject(new Error(`${ERROR_PREFIX}Image "${resource.src}" loading aborted.`));
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

    _prepareResult(value) {
        const
            rgb = value.slice(0, 3),
            rgba = [].concat(rgb, value[3] / 255),
            isDark = this._isDark(value);

        return {
            value,
            rgb: 'rgb(' + rgb.join(',') + ')',
            rgba: 'rgba(' + rgba.join(',') + ')',
            hex: this._arrayToHex(rgb),
            hexa: this._arrayToHex(value),
            isDark,
            isLight: !isDark
        };
    }

    _getOriginalSize(resource) {
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

    _toHex(num) {
        let str = num.toString(16);
        return str.length === 1 ? '0' + str : str;
    }

    _arrayToHex(arr) {
        return '#' + arr.map(this._toHex).join('');
    }

    _isDark(color) {
        // http://www.w3.org/TR/AERT#color-contrast
        const result = (color[0] * 299 + color[1] * 587 + color[2] * 114) / 1000;

        return result < 128;
    }

    _makeCanvas() {
        return typeof window === 'undefined' ?
            new OffscreenCanvas(1, 1) :
            document.createElement('canvas');
    }

    _outputError(options, error, details) {
        if (!options.silent) {
            // eslint-disable-next-line no-console
            console.error(`${ERROR_PREFIX}${error}`);

            if (details) {
                // eslint-disable-next-line no-console
                console.error(details);
            }
        }
    }
}
