/*! Fast Average Color | © 2018 Denis Seleznev | MIT License | https://github.com/hcodes/fast-average-color/ */
export default class FastAverageColor {
    /**
     * Get asynchronously the average color from not loaded image.
     *
     * @param {HTMLImageElement} resource
     * @param {Function} callback
     * @param {Object|null} [options]
     * @param {Array}  [options.defaultColor=[255, 255, 255, 255]]
     * @param {*}      [options.data]
     * @param {string} [options.mode="speed"] "precision" or "speed"
     * @param {string} [options.algorithm="sqrt"] "simple" or "sqrt"
     * @param {number} [options.step=1]
     * @param {number} [options.left=0]
     * @param {number} [options.top=0]
     * @param {number} [options.width=width of resource]
     * @param {number} [options.height=height of resource]
     */
    getColorAsync(resource, callback, options) {
        const data = options && options.data;

        if (resource.complete || resource.naturalWidth) {
            callback.call(resource, this.getColor.apply(this, arguments), data);
        } else {
            this._bindImageEvents(resource, callback, options);
        }
    }

    /**
     * Get the average color from images, videos and canvas.
     *
     * @param {HTMLImageElement|HTMLVideoElement|HTMLCanvasElement} resource
     * @param {Object|null} [options]
     * @param {Array}  [options.defaultColor=[255, 255, 255, 255]]
     * @param {*}      [options.data]
     * @param {string} [options.mode="speed"] "precision" or "speed"
     * @param {string} [options.algorithm="sqrt"] "simple" or "sqrt"
     * @param {number} [options.step=1]
     * @param {number} [options.left=0]
     * @param {number} [options.top=0]
     * @param {number} [options.width=width of resource]
     * @param {number} [options.height=height of resource]
     *
     * @returns {Object}
     */
    getColor(resource, options) {
        options = options || {};

        const
            defaultColor = this._getDefaultColor(options),
            originalSize = this._getOriginalSize(resource),
            size = this._prepareSizeAndPosition(originalSize, options);

        let
            error = null,
            value = defaultColor;

        if (!size.srcWidth || !size.srcHeight || !size.destWidth || !size.destHeight) {
            return this._prepareResult(
                defaultColor,
                new Error('FastAverageColor: Incorrect sizes.')
            );
        }

        if (!this._ctx) {
            this._canvas = document.createElement('canvas');
            this._ctx = this._canvas.getContext && this._canvas.getContext('2d');

            if (!this._ctx) {
                return this._prepareResult(
                    defaultColor,
                    new Error('FastAverageColor: Canvas Context 2D is not supported in this browser.')
                );
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
            // Security error, CORS
            // https://developer.mozilla.org/en/docs/Web/HTML/CORS_enabled_image
            error = e;
        }

        return this._prepareResult(value, error);
    }

    /**
     * Get the average color from a array when 1 pixel is 4 bytes.
     *
     * @param {Array|Uint8Array} arr
     * @param {Object} [options]
     * @param {string} [options.algorithm="sqrt"] "simple" or "sqrt"
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

        return options.algorithm === 'simple' ?
            this._simpleAlgorithm(arr, len, preparedStep) :
            this._sqrtAlgorithm(arr, len, preparedStep);
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

    _simpleAlgorithm(arr, len, preparedStep) {
        let
            redTotal = 0,
            greenTotal = 0,
            blueTotal = 0,
            alphaTotal = 0,
            count = 0;

        for (let i = 0; i < len; i += preparedStep) {
            const
                alpha = arr[i + 3],
                red = arr[i] * alpha,
                green = arr[i + 1] * alpha,
                blue = arr[i + 2] * alpha;

            redTotal += red;
            greenTotal += green;
            blueTotal += blue;
            alphaTotal += alpha;
            count++;
        }

        return alphaTotal ? [
            Math.round(redTotal / alphaTotal),
            Math.round(greenTotal / alphaTotal),
            Math.round(blueTotal / alphaTotal),
            Math.round(alphaTotal / count)
        ] : [0, 0, 0, 0];
    }

    _sqrtAlgorithm(arr, len, preparedStep) {
        let
            redTotal = 0,
            greenTotal = 0,
            blueTotal = 0,
            alphaTotal = 0,
            count = 0;

        for (let i = 0; i < len; i += preparedStep) {
            const
                red = arr[i],
                green = arr[i + 1],
                blue = arr[i + 2],
                alpha = arr[i + 3];

            redTotal += red * red * alpha;
            greenTotal += green * green * alpha;
            blueTotal += blue * blue * alpha;
            alphaTotal += alpha;
            count++;
        }

        return alphaTotal ? [
            Math.round(Math.sqrt(redTotal / alphaTotal)),
            Math.round(Math.sqrt(greenTotal / alphaTotal)),
            Math.round(Math.sqrt(blueTotal / alphaTotal)),
            Math.round(alphaTotal / count)
        ] : [0, 0, 0, 0];
    }
    _bindImageEvents(resource, callback, options) {
        options = options || {};

        const
            data = options && options.data,
            defaultColor = this._getDefaultColor(options);

        this._onload = () => {
            this._unbindImageEvents(resource);

            callback.call(
                resource,
                this.getColor(resource, options),
                data
            );
        };

        this._onerror = () => {
            this._unbindImageEvents(resource);

            callback.call(
                resource,
                this._prepareResult(defaultColor, new Error('Image error')),
                data
            );
        };

        this._onabort = () => {
            this._unbindImageEvents();

            callback.call(
                resource,
                this._prepareResult(defaultColor, new Error('Image abort')),
                data
            );
        };

        resource.addEventListener('load', this._onload);
        resource.addEventListener('error', this._onerror);
        resource.addEventListener('abort', this._onabort);
    }

    _unbindImageEvents(resource) {
        resource.removeEventListener('load', this._onload);
        resource.removeEventListener('error', this._onerror);
        resource.removeEventListener('abort', this._onabort);
    }

    _prepareResult(value, error) {
        const
            rgb = value.slice(0, 3),
            rgba = [].concat(rgb, value[3] / 255),
            isDark = this._isDark(value);

        return {
            error,
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
}
