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
     * Get asynchronously the average color from unloaded image.
     *
     * @param {HTMLImageElement} resource
     * @param {Function} callback
     * @param {Object|null} [options]
     * @param {Array}  [options.defaultColor=[255, 255, 255, 255]]
     * @param {*}      [options.data]
     * @param {string} [options.mode="speed"] "precision" or "speed"
     * @param {number} [options.left=0]
     * @param {number} [options.top=0]
     * @param {number} [options.width=width of resource]
     * @param {number} [options.height=height of resource]
     */


    _createClass(FastAverageColor, [{
        key: 'getColorFromUnloadedImage',
        value: function getColorFromUnloadedImage(resource, callback, options) {
            var data = options && options.data;

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
         * @param {number} [options.left=0]
         * @param {number} [options.top=0]
         * @param {number} [options.width=width of resource]
         * @param {number} [options.height=height of resource]
         *
         * @returns {Object}
         */

    }, {
        key: 'getColor',
        value: function getColor(resource, options) {
            options = options || {};

            var defaultColor = this._getDefaultColor(options),
                originalSize = this._getOriginalSize(resource),
                size = this._prepareSizeAndPosition(originalSize, options);

            var error = null,
                value = defaultColor;

            if (!size.srcWidth || !size.srcHeight || !size.destWidth || !size.destHeight) {
                return this._prepareResult(defaultColor, new Error('FastAverageColor: Incorrect sizes.'));
            }

            if (!this._ctx) {
                this._canvas = document.createElement('canvas');
                this._ctx = this._canvas.getContext && this._canvas.getContext('2d');

                if (!this._ctx) {
                    return this._prepareResult(defaultColor, new Error('FastAverageColor: Canvas Context 2D is not supported in this browser.'));
                }
            }

            this._canvas.width = size.destWidth;
            this._canvas.height = size.destHeight;

            try {
                this._ctx.clearRect(0, 0, size.destWidth, size.destHeight);
                this._ctx.drawImage(resource, size.srcLeft, size.srcTop, size.srcWidth, size.srcHeight, 0, 0, size.destWidth, size.destHeight);

                var bitmapData = this._ctx.getImageData(0, 0, size.destWidth, size.destHeight).data;
                value = this.getColorFromArray4(bitmapData);
            } catch (e) {
                // Security error, CORS
                // https://developer.mozilla.org/en/docs/Web/HTML/CORS_enabled_image
                error = e;
            }

            return this._prepareResult(value, error);
        }

        /**
         * Get the average color from a array when 1 pixel is 3 bytes.
         *
         * @param {Array|Uint8Array} arr
         * @param {number} [step=1]
         *
         * @returns {Array} [red (0-255), green (0-255), blue (0-255), alpha (255)]
         */

    }, {
        key: 'getColorFromArray3',
        value: function getColorFromArray3(arr, step) {
            var bytesPerPixel = 3,
                arrLength = arr.length;

            if (arrLength < bytesPerPixel) {
                return this._getDefaultColor();
            }

            var len = arrLength - arrLength % bytesPerPixel,
                preparedStep = (step || 1) * bytesPerPixel;

            var redTotal = 0,
                greenTotal = 0,
                blueTotal = 0,
                count = 0;

            for (var i = 0; i < len; i += preparedStep) {
                var red = arr[i],
                    green = arr[i + 1],
                    blue = arr[i + 2];

                redTotal += red * red;
                greenTotal += green * green;
                blueTotal += blue * blue;
                count++;
            }

            return [Math.round(Math.sqrt(redTotal / count)), Math.round(Math.sqrt(greenTotal / count)), Math.round(Math.sqrt(blueTotal / count)), 255];
        }

        /**
         * Get the average color from a array when 1 pixel is 4 bytes.
         *
         * @param {Array|Uint8Array} arr
         * @param {number} [step=1]
         *
         * @returns {Array} [red (0-255), green (0-255), blue (0-255), alpha (0-255)]
         */

    }, {
        key: 'getColorFromArray4',
        value: function getColorFromArray4(arr, step) {
            var bytesPerPixel = 4,
                arrLength = arr.length;

            if (arrLength < bytesPerPixel) {
                return this._getDefaultColor();
            }

            var len = arrLength - arrLength % bytesPerPixel,
                preparedStep = (step || 1) * bytesPerPixel;

            var redTotal = 0,
                greenTotal = 0,
                blueTotal = 0,
                alphaTotal = 0,
                count = 0;

            for (var i = 0; i < len; i += preparedStep) {
                var alpha = arr[i + 3] / 255,
                    alpha255 = alpha / 255,

                // i.e.: red = arr[i] / 255 * alpha
                red = arr[i] * alpha255,
                    green = arr[i + 1] * alpha255,
                    blue = arr[i + 2] * alpha255;

                redTotal += red * red;
                greenTotal += green * green;
                blueTotal += blue * blue;
                alphaTotal += alpha;
                count++;
            }

            var averageAlpha = alphaTotal / count,
                byteAlpha = Math.round(averageAlpha * 255);

            return byteAlpha ? [Math.round(Math.sqrt(redTotal / count / averageAlpha) * 255), Math.round(Math.sqrt(greenTotal / count / averageAlpha) * 255), Math.round(Math.sqrt(blueTotal / count / averageAlpha) * 255), byteAlpha] : [0, 0, 0, 0];
        }

        /**
         * Destroy the instance.
         */

    }, {
        key: 'destroy',
        value: function destroy() {
            delete this._canvas;
            delete this._ctx;
        }
    }, {
        key: '_getDefaultColor',
        value: function _getDefaultColor(options) {
            return options && options.defaultColor || this.defaultColor;
        }
    }, {
        key: '_getOption',
        value: function _getOption(options, name, defaultValue) {
            return typeof options[name] === 'undefined' ? defaultValue : options[name];
        }
    }, {
        key: '_prepareSizeAndPosition',
        value: function _prepareSizeAndPosition(originalSize, options) {
            var srcLeft = this._getOption(options, 'left', 0),
                srcTop = this._getOption(options, 'top', 0),
                srcWidth = this._getOption(options, 'width', originalSize.width),
                srcHeight = this._getOption(options, 'height', originalSize.height),
                destWidth = srcWidth,
                destHeight = srcHeight;

            if (options.mode === 'precision') {
                return {
                    srcLeft: srcLeft,
                    srcTop: srcTop,
                    srcWidth: srcWidth,
                    srcHeight: srcHeight,
                    destWidth: destWidth,
                    destHeight: destHeight
                };
            }

            var maxSize = 100,
                minSize = 10;

            var factor = void 0;

            if (srcWidth > srcHeight) {
                factor = srcWidth / srcHeight;
                destWidth = maxSize;
                destHeight = Math.round(destWidth / factor);
            } else {
                factor = srcHeight / srcWidth;
                destHeight = maxSize;
                destWidth = Math.round(destHeight / factor);
            }

            if (destWidth > srcWidth || destHeight > srcHeight || destWidth < minSize || destHeight < minSize) {
                destWidth = srcWidth;
                destHeight = srcHeight;
            }

            return {
                srcLeft: srcLeft,
                srcTop: srcTop,
                srcWidth: srcWidth,
                srcHeight: srcHeight,
                destWidth: destWidth,
                destHeight: destHeight
            };
        }
    }, {
        key: '_bindImageEvents',
        value: function _bindImageEvents(resource, callback, options) {
            var _this = this;

            var data = options && options.data;

            this._onload = function () {
                _this._unbindImageEvents(resource);

                callback.call(resource, _this.getColor(resource, options), data);
            };

            this._onerror = function () {
                _this._unbindImageEvents(resource);

                callback.call(resource, _this._prepareResult(_this._getDefaultColor(), new Error('Image error')), data);
            };

            this._onabort = function () {
                _this._unbindImageEvents();

                callback.call(resource, _this._prepareResult(_this._getDefaultColor(), new Error('Image abort')), data);
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
        key: '_prepareResult',
        value: function _prepareResult(value, error) {
            var rgb = value.slice(0, 3),
                rgba = [].concat(rgb, value[3] / 255),
                isDark = this._isDark(value);

            return {
                error: error,
                value: value,
                rgb: 'rgb(' + rgb.join(',') + ')',
                rgba: 'rgba(' + rgba.join(',') + ')',
                hex: this._arrayToHex(rgb),
                hexa: this._arrayToHex(value),
                isDark: isDark,
                isLight: !isDark
            };
        }
    }, {
        key: '_getOriginalSize',
        value: function _getOriginalSize(resource) {
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
            // http://www.w3.org/TR/AERT#color-contrast
            var result = (color[0] * 299 + color[1] * 587 + color[2] * 114) / 1000;

            return result < 128;
        }
    }]);

    return FastAverageColor;
}();

return FastAverageColor;

})));
