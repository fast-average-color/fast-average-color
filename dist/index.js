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
     * Get average color from images and canvas.
     *
     * @param {HTMLImageElement|HTMLCanvasElement} resource
     * @param {Object|null} options
     * @param {Array} [options.defaultColor]
     * @param {number} [options.left]
     * @param {number} [options.top]
     * @param {number} [options.width]
     * @param {number} [options.height]
     * @param {Function} callback
     */


    _createClass(FastAverageColor, [{
        key: 'get',
        value: function get(resource, options, callback) {
            if (resource instanceof HTMLImageElement) {
                if (resource.complete || resource.naturalWidth) {
                    callback(this.getSync.apply(this, arguments));
                } else {
                    this.bindImageEvents(resource, options, callback);
                }
            } else if (resource instanceof HTMLCanvasElement) {
                callback(this.getSync.apply(this, arguments));
            }

            // TODO: HTMLVideoElement
        }

        /**
         * Get sync average color from images and canvas.
         *
         * @param {HTMLImageElement|HTMLCanvasElement} resource
         * @param {Object|null} options
         *
         * @returns {Object}
         */

    }, {
        key: 'getSync',
        value: function getSync(resource, options) {
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
                ctx.drawImage(resource, left, top, width, height, 0, 0, size, size);

                var bitmapData = ctx.getImageData(0, 0, size, size).data;
                value = [bitmapData[0], // red
                bitmapData[1], // green
                bitmapData[2], // blue
                bitmapData[3] // alpha
                ];
            } catch (e) {
                // Security error, CORS
                // https://developer.mozilla.org/ru/docs/Web/HTML/CORS_enabled_image
                error = e;
            }

            return this._getResult(value, error);
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
        value: function _bindImageEvents(resource, options, callback) {
            var _this = this;

            this._onload = this._oncached = function () {
                _this._unbindImageEvents();
                callback(_this.getSync(resource, options));
            };

            this._onerror = function () {
                _this._unbindImageEvents();
                callback(_this._getResult(_this._getDefaultColor(), new Error('Image error')));
            };

            this._onabort = function () {
                _this._unbindImageEvents();
                callback(_this._getResult(_this._getDefaultColor(), new Error('Image abort')));
            };

            resource.addEventListener('load', this._onload);
            resource.addEventListener('cached', this._onload);

            resource.addEventListener('error', this._onerror);
            resource.addEventListener('abort', this._onabort);
        }
    }, {
        key: '_unbindImageEvents',
        value: function _unbindImageEvents(resource) {
            resource.removeEventListener('load', this._onload);
            resource.removeEventListener('cached', this._onload);

            resource.removeEventListener('error', this._onerror);
            resource.removeEventListener('abort', this._onabort);
        }
    }, {
        key: '_getResult',
        value: function _getResult(value, error) {
            var rgb = value.slice(0, 3),
                rgba = [].concat(rgb, Math.floor(value[3] / 255));

            return {
                rgb: 'rgb(' + rgb.join(',') + ')',
                rgba: 'rgba(' + rgba.join(',') + ')',
                hex: this._arrayToHex(rgb),
                hexa: this._arrayToHex(value),
                value: value,
                error: error,
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
