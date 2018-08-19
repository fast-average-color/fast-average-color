/*! Fast Average Color | © 2018 Denis Seleznev | MIT License | https://github.com/hcodes/fast-average-color/ */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.FastAverageColor = factory());
}(this, (function () { 'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FastAverageColor = function () {
    function FastAverageColor() {
        _classCallCheck(this, FastAverageColor);
    }

    _createClass(FastAverageColor, [{
        key: 'getColorAsync',

        /**
         * Get asynchronously the average color from not loaded image.
         *
         * @param {HTMLImageElement} resource
         * @param {Function} callback
         * @param {Object|null} [options]
         * @param {Array}  [options.defaultColor=[255, 255, 255, 255]]
         * @param {*}      [options.data]
         * @param {string} [options.mode="speed"] "precision" or "speed"
         * @param {string} [options.algorithm="sqrt"] "simple", "sqrt" or "dominant"
         * @param {number} [options.step=1]
         * @param {number} [options.left=0]
         * @param {number} [options.top=0]
         * @param {number} [options.width=width of resource]
         * @param {number} [options.height=height of resource]
         */
        value: function getColorAsync(resource, callback, options) {
            if (resource.complete) {
                callback.call(resource, this.getColor(resource, options), options && options.data);
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
         * @param {string} [options.algorithm="sqrt"] "simple", "sqrt" or "dominant"
         * @param {number} [options.step=1]
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
         * @param {string} [options.algorithm="sqrt"] "simple", "sqrt" or "dominant"
         * @param {Array}  [options.defaultColor=[255, 255, 255, 255]]
         * @param {number} [options.step=1]
         *
         * @returns {Array} [red (0-255), green (0-255), blue (0-255), alpha (0-255)]
         */

    }, {
        key: 'getColorFromArray4',
        value: function getColorFromArray4(arr, options) {
            options = options || {};

            var bytesPerPixel = 4,
                arrLength = arr.length;

            if (arrLength < bytesPerPixel) {
                return this._getDefaultColor(options);
            }

            var len = arrLength - arrLength % bytesPerPixel,
                preparedStep = (options.step || 1) * bytesPerPixel,
                algorithm = '_' + (options.algorithm || 'sqrt') + 'Algorithm';

            if (typeof this[algorithm] !== 'function') {
                throw new Error('FastAverageColor: ' + options.algorithm + ' is unknown algorithm.');
            }

            return this[algorithm](arr, len, preparedStep);
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
            return this._getOption(options, 'defaultColor', [255, 255, 255, 255]);
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
        key: '_simpleAlgorithm',
        value: function _simpleAlgorithm(arr, len, preparedStep) {
            var redTotal = 0,
                greenTotal = 0,
                blueTotal = 0,
                alphaTotal = 0,
                count = 0;

            for (var i = 0; i < len; i += preparedStep) {
                var alpha = arr[i + 3],
                    red = arr[i] * alpha,
                    green = arr[i + 1] * alpha,
                    blue = arr[i + 2] * alpha;

                redTotal += red;
                greenTotal += green;
                blueTotal += blue;
                alphaTotal += alpha;
                count++;
            }

            return alphaTotal ? [Math.round(redTotal / alphaTotal), Math.round(greenTotal / alphaTotal), Math.round(blueTotal / alphaTotal), Math.round(alphaTotal / count)] : [0, 0, 0, 0];
        }
    }, {
        key: '_sqrtAlgorithm',
        value: function _sqrtAlgorithm(arr, len, preparedStep) {
            var redTotal = 0,
                greenTotal = 0,
                blueTotal = 0,
                alphaTotal = 0,
                count = 0;

            for (var i = 0; i < len; i += preparedStep) {
                var red = arr[i],
                    green = arr[i + 1],
                    blue = arr[i + 2],
                    alpha = arr[i + 3];

                redTotal += red * red * alpha;
                greenTotal += green * green * alpha;
                blueTotal += blue * blue * alpha;
                alphaTotal += alpha;
                count++;
            }

            return alphaTotal ? [Math.round(Math.sqrt(redTotal / alphaTotal)), Math.round(Math.sqrt(greenTotal / alphaTotal)), Math.round(Math.sqrt(blueTotal / alphaTotal)), Math.round(alphaTotal / count)] : [0, 0, 0, 0];
        }
    }, {
        key: '_dominantAlgorithm',
        value: function _dominantAlgorithm(arr, len, preparedStep) {
            var colorHash = {},
                divider = 24;

            for (var i = 0; i < len; i += preparedStep) {
                var red = arr[i],
                    green = arr[i + 1],
                    blue = arr[i + 2],
                    alpha = arr[i + 3],
                    key = Math.round(red / divider) + ',' + Math.round(green / divider) + ',' + Math.round(blue / divider);

                if (colorHash[key]) {
                    colorHash[key] = [colorHash[key][0] + red * alpha, colorHash[key][1] + green * alpha, colorHash[key][2] + blue * alpha, colorHash[key][3] + alpha, colorHash[key][4] + 1];
                } else {
                    colorHash[key] = [red * alpha, green * alpha, blue * alpha, alpha, 1];
                }
            }

            var buffer = Object.keys(colorHash).map(function (key) {
                return colorHash[key];
            }).sort(function (a, b) {
                var countA = a[4],
                    countB = b[4];

                return countA > countB ? -1 : countA === countB ? 0 : 1;
            });

            var _buffer$ = _slicedToArray(buffer[0], 5),
                redTotal = _buffer$[0],
                greenTotal = _buffer$[1],
                blueTotal = _buffer$[2],
                alphaTotal = _buffer$[3],
                count = _buffer$[4];

            return alphaTotal ? [Math.round(redTotal / alphaTotal), Math.round(greenTotal / alphaTotal), Math.round(blueTotal / alphaTotal), Math.round(alphaTotal / count)] : [0, 0, 0, 0];
        }
    }, {
        key: '_bindImageEvents',
        value: function _bindImageEvents(resource, callback, options) {
            var _this = this;

            options = options || {};

            var data = options && options.data,
                defaultColor = this._getDefaultColor(options),
                onload = function onload() {
                unbindEvents();

                callback.call(resource, _this.getColor(resource, options), data);
            },
                onerror = function onerror() {
                unbindEvents();

                callback.call(resource, _this._prepareResult(defaultColor, new Error('Image error')), data);
            },
                onabort = function onabort() {
                unbindEvents();

                callback.call(resource, _this._prepareResult(defaultColor, new Error('Image abort')), data);
            },
                unbindEvents = function unbindEvents() {
                resource.removeEventListener('load', onload);
                resource.removeEventListener('error', onerror);
                resource.removeEventListener('abort', onabort);
            };

            resource.addEventListener('load', onload);
            resource.addEventListener('error', onerror);
            resource.addEventListener('abort', onabort);
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
