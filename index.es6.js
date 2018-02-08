/* Fast Average Color | © 2018 Denis Seleznev | MIT License | https://github.com/hcodes/fast-average-color/ */
export default class AverageColor {
    constructor(settings) {
        this.defaultColor = settings && settings.defaultColor || [255, 255, 255, 255];
    },
    /**
     * Get average color from images and canvas.
     *
     * @param {HTMLImageElement|HTMLCanvasElement} resource
     * @param {Object|null} options
     * @param {Array} [options.defaultColor]
     * @param {number} [options.x]
     * @param {number} [options.y]
     * @param {number} [options.width]
     * @param {number} [options.height]
     * @param {Function} callback
     */
    get(resource, options, callback) {
        if (resource instanceof HTMLImageElement) {
            if (resource.complete || resource.naturalWidth) {
                callback(this.getSync.apply(this, arguments));
            } else {
                this.bindImageEvents(resource, options, callback);
            }
        } else if (resource instanceof HTMLCanvasElement) {
            callback(this.getSync.apply(this, arguments));
        }

        // TODO videos
    },
    /**
     * Get sync average color from images and canvas.
     *
     * @param {HTMLImageElement|HTMLCanvasElement} resource
     * @param {Object|null} options
     *
     * @returns {Object}
     */
    getSync(resource, options) {
        options = options || {};

        const canvas = this._canvas || document.createElement('canvas'),
            error = null,
            defaultColor = this._getDefaultColor(options),
            size = 1;

        canvas.width = canvas.height = size;

        const ctx = canvas.getContext('2d');
        let
            x = 'x' in options ? options.x : 0,
            y = 'y' in options ? options.y : 0,
            width = 'width' in options ? options.width : resource.width,
            height = 'height' in options ? options.height : resource.height;

        try {
            ctx.drawImage(resource, x, y, width, height, 0, 0, size, size);
            const
                bitmapData = ctx.getImageData(0, 0, size, size).data,
                value = [
                    bitmapData[0], // red
                    bitmapData[1], // green
                    bitmapData[2], // blue
                    bitmapData[3] // alpha
                ];
        } catch(e) {
            error = e;
            value = defaultColor;
        }

        return this._getResult(value, error);
    },
    /**
     * Destroy instance.
     */
    destroy() {
        delete this._canvas;
    },
    _getDefaultColor(options) {
        return  (options && options.defaultColor) || this.defaultColor;
    },
    _bindImageEvents(resource, options, callback) {
        this._onload = this._oncached = () => {
            this._unbindImageEvents();
            callback(this.getSync(resource, options));
        };

        this._onerror = () => {
            this._unbindImageEvents();
            callback(this._getResult(this._getDefaultColor(), new Error('Image error')));
        };

        this._onabort = () => {
            this._unbindImageEvents();
            callback(this._getResult(this._getDefaultColor(), new Error('Image abort')));
        };

        resource.addEventListener('load', this._onload);
        resource.addEventListener('cached', this._onload);

        resource.addEventListener('error', this._onerror);
        resource.addEventListener('abort', this._onabort);
    },
    _unbindImageEvents(resource) {
        resource.removeEventListener('load', this._onload);
        resource.removeEventListener('cached', this._onload);

        resource.removeEventListener('error', this._onerror);
        resource.removeEventListener('abort', this._onabort);
    },
    _getResult(value, error) {
        const rgb = value.slice(0, 3);

        return {
            rgb: 'rgb(' + rgb.join(',') + ')',
            rgba: 'rgba(' + rgb.push(Math.floor(value[3] / 255)).join(',') + ')',
            hex: this._arrayToHex(rgb),
            hexa: this._arrayToHex(value),
            value,
            error,
            isDark: this._isDark(value)
        };
    },
    _toHex(num) {
        let str = num.toString(16);
        return str.length === 1 ? '0' + str : str;
    },
    _arrayToHex(arr) {
        return '#' + arr.map(this._toHex).join('');
    },
    _isDark(color) {
        let count = 0;
        color.forEach(function(colorComponent) {
            count += colorComponent < 128 ? 1 : 0;
        });

        return count >= 2;
    }
}
