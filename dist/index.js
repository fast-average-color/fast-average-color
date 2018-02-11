/*! Fast Average Color | © 2018 Denis Seleznev | MIT License | https://github.com/hcodes/fast-average-color/ */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.FastAverageColor = factory());
}(this, (function () { 'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FastAverageColor = function () {
    function FastAverageColor(settings) {
        _classCallCheck(this, FastAverageColor);

        this.defaultColor = settings && settings.defaultColor || [255, 255, 255, 255]; // white
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


    _createClass(FastAverageColor, [{
        key: 'getColor',
        value: function getColor(resource, callback, options) {
            var data = options && options.data;

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

    }, {
        key: 'getColorSync',
        value: function getColorSync(resource, options) {
            options = options || {};

            var canvas = this._canvas || document.createElement('canvas'),
                defaultColor = this._getDefaultColor(options),
                size = 1;

            canvas.width = canvas.height = size;

            var ctx = canvas.getContext('2d');
            var error = null,
                left = 'left' in options ? options.left : 0,
                top = 'top' in options ? options.top : 0,
                width = 'width' in options ? options.width : resource.width,
                height = 'height' in options ? options.height : resource.height,
                value = defaultColor;

            try {
                ctx.clearRect(0, 0, size, size);
                ctx.drawImage(resource, left, top, width, height, 0, 0, size, size);

                var bitmapData = ctx.getImageData(0, 0, size, size).data;
                value = [bitmapData[0], // red,   0-255
                bitmapData[1], // green, 0-255
                bitmapData[2], // blue,  0-255
                bitmapData[3] // alpha, 0-255
                ];
            } catch (e) {
                // Security error, CORS
                // https://developer.mozilla.org/ru/docs/Web/HTML/CORS_enabled_image
                error = e;
            }

            return this._getResult(value, error);
        }

        /**
         * Get the average color from a array when 1 pixel is 3 bytes.
         *
         * @param {Array|Uint8Array} arr
         *
         * @returns {Array} [red (0-255), green (0-255), blue (0-255), alpha (0-255)]
         */

    }, {
        key: 'getColorFromArray3',
        value: function getColorFromArray3(arr) {
            if (arr.length < 3) {
                return this._getDefaultColor();
            }

            var len = arr.length - arr.length % 3;

            var red = 0,
                green = 0,
                blue = 0,
                count = 0;

            for (var i = 0; i < len; i += 3) {
                red += arr[i];
                green += arr[i + 1];
                blue += arr[i + 2];
                count++;
            }

            return [Math.floor(red / count), Math.floor(green / count), Math.floor(blue / count), 255];
        }

        /**
         * Get the average color from a array when 1 pixel is 4 bytes.
         *
         * @param {Array|Uint8Array} arr
         *
         * @returns {Array} [red (0-255), green (0-255), blue (0-255), alpha (0-255)]
         */

    }, {
        key: 'getColorFromArray4',
        value: function getColorFromArray4(arr) {
            if (arr.length < 4) {
                return this._getDefaultColor();
            }

            var len = arr.length - arr.length % 4;

            var red = 0,
                green = 0,
                blue = 0,
                alpha = 0,
                count = 0;

            for (var i = 0; i < len; i += 4) {
                red += arr[i];
                green += arr[i + 1];
                blue += arr[i + 2];
                alpha += arr[i + 3];
                count++;
            }

            return [Math.floor(red / count), Math.floor(green / count), Math.floor(blue / count), Math.floor(alpha / count)];
        }

        /**
         * Destroy instance.
         */

    }, {
        key: 'destroy',
        value: function destroy() {
            delete this._canvas;
        }
    }, {
        key: '_getDefaultColor',
        value: function _getDefaultColor(options) {
            return options && options.defaultColor || this.defaultColor;
        }
    }, {
        key: '_bindImageEvents',
        value: function _bindImageEvents(resource, callback, options) {
            var _this = this;

            var data = options && options.data;

            this._onload = function () {
                _this._unbindImageEvents();

                callback.call(resource, _this.getColorSync(resource, options), data);
            };

            this._onerror = function () {
                _this._unbindImageEvents();

                callback.call(resource, _this._getResult(_this._getDefaultColor(), new Error('Image error')), data);
            };

            this._onabort = function () {
                _this._unbindImageEvents();

                callback.call(resource, _this._getResult(_this._getDefaultColor(), new Error('Image abort')), data);
            };

            resource.addEventListener('load', this._onload);
            resource.addEventListener('error', this._onerror);
            resource.addEventListener('abort', this._onabort);
        }
    }, {
        key: '_unbindImageEvents',
        value: function _unbindImageEvents(resource) {
            resource.removeEventListener('load', this._onload);
            resource.removeEventListener('error', this._onerror);
            resource.removeEventListener('abort', this._onabort);
        }
    }, {
        key: '_getResult',
        value: function _getResult(value, error) {
            var rgb = value.slice(0, 3),
                rgba = [].concat(rgb, value[3] / 255);

            return {
                error: error,
                value: value,
                rgb: 'rgb(' + rgb.join(',') + ')',
                rgba: 'rgba(' + rgba.join(',') + ')',
                hex: this._arrayToHex(rgb),
                hexa: this._arrayToHex(value),
                isDark: this._isDark(value)
            };
        }
    }, {
        key: '_toHex',
        value: function _toHex(num) {
            var str = num.toString(16);
            return str.length === 1 ? '0' + str : str;
        }
    }, {
        key: '_arrayToHex',
        value: function _arrayToHex(arr) {
            return '#' + arr.map(this._toHex).join('');
        }
    }, {
        key: '_isDark',
        value: function _isDark(color) {
            var count = 0;
            color.forEach(function (colorComponent) {
                count += colorComponent < 128 ? 1 : 0;
            });

            return count >= 2;
        }
    }]);

    return FastAverageColor;
}();

return FastAverageColor;

})));
