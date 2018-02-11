/*! Fast Average Color | © 2018 Denis Seleznev | MIT License | https://github.com/hcodes/fast-average-color/ */
export default class FastAverageColor {
    constructor(settings) {
        this.defaultColor = settings &&
            settings.defaultColor ||
            [255, 255, 255, 255]; // white
    }

    /**
     * Get asynchronously the average color from images and canvas.
     *
     * @param {HTMLImageElement|HTMLCanvasElement} resource
     * @param {Function} callback
     * @param {Object|null} [options]
     * @param {Array} [options.defaultColor]
     * @param {*} [options.data]
     * @param {number} [options.left]
     * @param {number} [options.top]
     * @param {number} [options.width]
     * @param {number} [options.height]
     */
    getColor(resource, callback, options) {
        const data = options && options.data;

        if (resource instanceof HTMLImageElement) {
            if (resource.complete || resource.naturalWidth) {
                callback.call(resource, this.getColorSync.apply(this, arguments), data);
            } else {
                this._bindImageEvents(resource, callback, options);
            }
        } else if (resource instanceof HTMLCanvasElement) {
            callback.call(resource, this.getColorSync.apply(this, arguments), data);
        }

        // TODO: HTMLVideoElement
    }

    /**
     * Get synchronously the average color from images and canvas.
     *
     * @param {HTMLImageElement|HTMLCanvasElement} resource
     * @param {Object|null} options
     *
     * @returns {Object}
     */
    getColorSync(resource, options) {
        options = options || {};

        const
            defaultColor = this._getDefaultColor(options),
            size = 1;

        let ctx = this._ctx;
        
        if (!ctx) {
            const canvas = document.createElement('canvas');
            canvas.width = canvas.height = size;
            ctx = canvas.getContext && canvas.getContext('2d');

            if (!ctx) {
                return this._getResult(
                    defaultColor,
                    new Error('Canvas: Context 2D is not supported in this browser.')
                );
            }

            this._ctx = ctx;
        }

        let
            error = null,
            left = 'left' in options ? options.left : 0,
            top = 'top' in options ? options.top : 0,
            width = 'width' in options ? options.width : resource.width,
            height = 'height' in options ? options.height : resource.height,
            value = defaultColor;

        try {
            ctx.clearRect(0, 0, size, size);
            ctx.drawImage(resource, left, top, width, height, 0, 0, size, size);

            const bitmapData = ctx.getImageData(0, 0, size, size).data;
            value = [
                bitmapData[0], // red,   0-255
                bitmapData[1], // green, 0-255
                bitmapData[2], // blue,  0-255
                bitmapData[3]  // alpha, 0-255
            ];
        } catch (e) {
            // Security error, CORS
            // https://developer.mozilla.org/en/docs/Web/HTML/CORS_enabled_image
            error = e;
        }

        return this._getResult(value, error);
    }

    /**
     * Get the average color from a array when 1 pixel is 3 bytes.
     *
     * @param {Array|Uint8Array} arr
     * @param {number} [step=1]
     *
     * @returns {Array} [red (0-255), green (0-255), blue (0-255), alpha (255)]
     */
    getColorFromArray3(arr) {
        if (arr.length < 3) {
            return this._getDefaultColor();
        }

        const
            len = arr.length - arr.length % 3,
            preparedStep = (step || 1) * 3;

        let
            red = 0,
            green = 0,
            blue = 0,
            count = 0;

        for (let i = 0; i < len; i += preparedStep) {
            red += arr[i];
            green += arr[i + 1];
            blue += arr[i + 2];
            count++;
        }

        return [
            Math.floor(red / count),
            Math.floor(green / count),
            Math.floor(blue / count),
            255
        ];
    }

    /**
     * Get the average color from a array when 1 pixel is 4 bytes.
     *
     * @param {Array|Uint8Array} arr
     * @param {number} [step=1]
     *
     * @returns {Array} [red (0-255), green (0-255), blue (0-255), alpha (0-255)]
     */
    getColorFromArray4(arr, step) {
        if (arr.length < 4) {
            return this._getDefaultColor();
        }

        const
            len = arr.length - arr.length % 4,
            preparedStep = (step || 1) * 4;

        let
            red = 0,
            green = 0,
            blue = 0,
            alpha = 0,
            count = 0;

        for (let i = 0; i < len; i += preparedStep) {
            red += arr[i];
            green += arr[i + 1];
            blue += arr[i + 2];
            alpha += arr[i + 3];
            count++;
        }

        return [
            Math.floor(red / count),
            Math.floor(green / count),
            Math.floor(blue / count),
            Math.floor(alpha / count)
        ];
    }

    /**
     * Destroy the instance.
     */
    destroy() {
        delete this._ctx;
    }

    _getDefaultColor(options) {
        return  (options && options.defaultColor) || this.defaultColor;
    }

    _bindImageEvents(resource, callback, options) {
        const data = options && options.data;

        this._onload = () => {
            this._unbindImageEvents();

            callback.call(
                resource,
                this.getColorSync(resource, options),
                data
            );
        };

        this._onerror = () => {
            this._unbindImageEvents();

            callback.call(
                resource,
                this._getResult(this._getDefaultColor(), new Error('Image error')),
                data
            );
        };

        this._onabort = () => {
            this._unbindImageEvents();

            callback.call(
                resource,
                this._getResult(this._getDefaultColor(), new Error('Image abort')),
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

    _getResult(value, error) {
        const
            rgb = value.slice(0, 3),
            rgba = [].concat(rgb, value[3] / 255);

        return {
            error,
            value,
            rgb: 'rgb(' + rgb.join(',') + ')',
            rgba: 'rgba(' + rgba.join(',') + ')',
            hex: this._arrayToHex(rgb),
            hexa: this._arrayToHex(value),
            isDark: this._isDark(value)
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
        let count = 0;
        color.forEach(function(colorComponent) {
            count += colorComponent < 128 ? 1 : 0;
        });

        return count >= 2;
    }
}
