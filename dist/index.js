/*! Fast Average Color | © 2021 Denis Seleznev | MIT License | https://github.com/fast-average-color/fast-average-color */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.FastAverageColor = factory());
})(this, (function () { 'use strict';

    function toHex(num) {
        var str = num.toString(16);
        return str.length === 1 ? '0' + str : str;
    }
    function arrayToHex(arr) {
        return '#' + arr.map(toHex).join('');
    }
    function isDark(color) {
        // http://www.w3.org/TR/AERT#color-contrast
        var result = (color[0] * 299 + color[1] * 587 + color[2] * 114) / 1000;
        return result < 128;
    }
    function prepareIgnoredColor(color) {
        if (!color) {
            return [];
        }
        return isRGBArray(color) ? color : [color];
    }
    function isRGBArray(value) {
        return Array.isArray(value[0]);
    }
    function isIgnoredColor(data, index, ignoredColor) {
        for (var i = 0; i < ignoredColor.length; i++) {
            if (isIgnoredColorAsNumbers(data, index, ignoredColor[i])) {
                return true;
            }
        }
        return false;
    }
    function isIgnoredColorAsNumbers(data, index, ignoredColor) {
        switch (ignoredColor.length) {
            case 3:
                // [red, green, blue]
                if (isIgnoredRGBColor(data, index, ignoredColor)) {
                    return true;
                }
                break;
            case 4:
                // [red, green, blue, alpha]
                if (isIgnoredRGBAColor(data, index, ignoredColor)) {
                    return true;
                }
                break;
            case 5:
                // [red, green, blue, alpha, threshold]
                if (isIgnoredRGBAColorWithThreshold(data, index, ignoredColor)) {
                    return true;
                }
                break;
            default:
                return false;
        }
    }
    function isIgnoredRGBColor(data, index, ignoredColor) {
        // Ignore if the pixel are transparent.
        if (data[index + 3] !== 255) {
            return true;
        }
        if (data[index] === ignoredColor[0] &&
            data[index + 1] === ignoredColor[1] &&
            data[index + 2] === ignoredColor[2]) {
            return true;
        }
        return false;
    }
    function isIgnoredRGBAColor(data, index, ignoredColor) {
        if (data[index + 3] && ignoredColor[3]) {
            return data[index] === ignoredColor[0] &&
                data[index + 1] === ignoredColor[1] &&
                data[index + 2] === ignoredColor[2] &&
                data[index + 3] === ignoredColor[3];
        }
        // Ignore rgb components if the pixel are fully transparent.
        return data[index + 3] === ignoredColor[3];
    }
    function inRange(colorComponent, ignoredColorComponent, value) {
        return colorComponent >= (ignoredColorComponent - value) &&
            colorComponent <= (ignoredColorComponent + value);
    }
    function isIgnoredRGBAColorWithThreshold(data, index, ignoredColor) {
        var redIgnored = ignoredColor[0];
        var greenIgnored = ignoredColor[1];
        var blueIgnored = ignoredColor[2];
        var alphaIgnored = ignoredColor[3];
        var threshold = ignoredColor[4];
        var alphaData = data[index + 3];
        var alphaInRange = inRange(alphaData, alphaIgnored, threshold);
        if (!alphaIgnored) {
            return alphaInRange;
        }
        if (!alphaData && alphaInRange) {
            return true;
        }
        if (inRange(data[index], redIgnored, threshold) &&
            inRange(data[index + 1], greenIgnored, threshold) &&
            inRange(data[index + 2], blueIgnored, threshold) &&
            alphaInRange) {
            return true;
        }
        return false;
    }

    function dominantAlgorithm(arr, len, options) {
        var colorHash = {};
        var divider = 24;
        var ignoredColor = options.ignoredColor;
        var step = options.step;
        var max = [0, 0, 0, 0, 0];
        for (var i = 0; i < len; i += step) {
            var red = arr[i];
            var green = arr[i + 1];
            var blue = arr[i + 2];
            var alpha = arr[i + 3];
            if (ignoredColor && isIgnoredColor(arr, i, ignoredColor)) {
                continue;
            }
            var key = Math.round(red / divider) + ',' +
                Math.round(green / divider) + ',' +
                Math.round(blue / divider);
            if (colorHash[key]) {
                colorHash[key] = [
                    colorHash[key][0] + red * alpha,
                    colorHash[key][1] + green * alpha,
                    colorHash[key][2] + blue * alpha,
                    colorHash[key][3] + alpha,
                    colorHash[key][4] + 1
                ];
            }
            else {
                colorHash[key] = [red * alpha, green * alpha, blue * alpha, alpha, 1];
            }
            if (max[4] < colorHash[key][4]) {
                max = colorHash[key];
            }
        }
        var redTotal = max[0];
        var greenTotal = max[1];
        var blueTotal = max[2];
        var alphaTotal = max[3];
        var count = max[4];
        return alphaTotal ? [
            Math.round(redTotal / alphaTotal),
            Math.round(greenTotal / alphaTotal),
            Math.round(blueTotal / alphaTotal),
            Math.round(alphaTotal / count)
        ] : options.defaultColor;
    }

    function simpleAlgorithm(arr, len, options) {
        var redTotal = 0;
        var greenTotal = 0;
        var blueTotal = 0;
        var alphaTotal = 0;
        var count = 0;
        var ignoredColor = options.ignoredColor;
        var step = options.step;
        for (var i = 0; i < len; i += step) {
            var alpha = arr[i + 3];
            var red = arr[i] * alpha;
            var green = arr[i + 1] * alpha;
            var blue = arr[i + 2] * alpha;
            if (ignoredColor && isIgnoredColor(arr, i, ignoredColor)) {
                continue;
            }
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
        ] : options.defaultColor;
    }

    function sqrtAlgorithm(arr, len, options) {
        var redTotal = 0;
        var greenTotal = 0;
        var blueTotal = 0;
        var alphaTotal = 0;
        var count = 0;
        var ignoredColor = options.ignoredColor;
        var step = options.step;
        for (var i = 0; i < len; i += step) {
            var red = arr[i];
            var green = arr[i + 1];
            var blue = arr[i + 2];
            var alpha = arr[i + 3];
            if (ignoredColor && isIgnoredColor(arr, i, ignoredColor)) {
                continue;
            }
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
        ] : options.defaultColor;
    }

    function getDefaultColor(options) {
        return getOption(options, 'defaultColor', [0, 0, 0, 0]);
    }
    function getOption(options, name, defaultValue) {
        return (options[name] === undefined ? defaultValue : options[name]);
    }

    var MIN_SIZE = 10;
    var MAX_SIZE = 100;
    function isSvg(filename) {
        return filename.search(/\.svg(\?|$)/i) !== -1;
    }
    function getOriginalSize(resource) {
        if (resource instanceof HTMLImageElement) {
            var width = resource.naturalWidth;
            var height = resource.naturalHeight;
            // For SVG images with only viewBox attr.
            if (!resource.naturalWidth && isSvg(resource.src)) {
                width = height = MAX_SIZE;
            }
            return {
                width: width,
                height: height,
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
    function getSrc(resource) {
        return resource instanceof HTMLCanvasElement ? 'canvas' : resource.src;
    }
    function prepareSizeAndPosition(originalSize, options) {
        var srcLeft = getOption(options, 'left', 0);
        var srcTop = getOption(options, 'top', 0);
        var srcWidth = getOption(options, 'width', originalSize.width);
        var srcHeight = getOption(options, 'height', originalSize.height);
        var destWidth = srcWidth;
        var destHeight = srcHeight;
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
        var factor;
        if (srcWidth > srcHeight) {
            factor = srcWidth / srcHeight;
            destWidth = MAX_SIZE;
            destHeight = Math.round(destWidth / factor);
        }
        else {
            factor = srcHeight / srcWidth;
            destHeight = MAX_SIZE;
            destWidth = Math.round(destHeight / factor);
        }
        if (destWidth > srcWidth || destHeight > srcHeight ||
            destWidth < MIN_SIZE || destHeight < MIN_SIZE) {
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
    function makeCanvas() {
        return typeof window === 'undefined' ?
            new OffscreenCanvas(1, 1) :
            document.createElement('canvas');
    }

    var ERROR_PREFIX = 'FastAverageColor: ';
    function outputError(message, silent, error) {
        if (!silent) {
            console.error(ERROR_PREFIX + message);
            if (error) {
                console.error(error);
            }
        }
    }
    function getError(text) {
        return Error(ERROR_PREFIX + text);
    }

    var FastAverageColor = /** @class */ (function () {
        function FastAverageColor() {
            this.canvas = null;
            this.ctx = null;
        }
        /**
         * Get asynchronously the average color from not loaded image.
         */
        FastAverageColor.prototype.getColorAsync = function (resource, options) {
            if (!resource) {
                return Promise.reject(getError('call .getColorAsync() without resource.'));
            }
            if (typeof resource === 'string') {
                var img = new Image();
                img.crossOrigin = '';
                img.src = resource;
                return this.bindImageEvents(img, options);
            }
            else if (resource instanceof Image && !resource.complete) {
                return this.bindImageEvents(resource, options);
            }
            else {
                var result = this.getColor(resource, options);
                return result.error ? Promise.reject(result.error) : Promise.resolve(result);
            }
        };
        /**
         * Get the average color from images, videos and canvas.
         */
        FastAverageColor.prototype.getColor = function (resource, options) {
            options = options || {};
            var defaultColor = getDefaultColor(options);
            if (!resource) {
                outputError('call .getColor(null) without resource.', options.silent);
                return this.prepareResult(defaultColor);
            }
            var originalSize = getOriginalSize(resource);
            var size = prepareSizeAndPosition(originalSize, options);
            if (!size.srcWidth || !size.srcHeight || !size.destWidth || !size.destHeight) {
                outputError("incorrect sizes for resource \"" + getSrc(resource) + "\".", options.silent);
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
            var value = defaultColor;
            try {
                this.ctx.clearRect(0, 0, size.destWidth, size.destHeight);
                this.ctx.drawImage(resource, size.srcLeft, size.srcTop, size.srcWidth, size.srcHeight, 0, 0, size.destWidth, size.destHeight);
                var bitmapData = this.ctx.getImageData(0, 0, size.destWidth, size.destHeight).data;
                value = this.getColorFromArray4(bitmapData, options);
            }
            catch (e) {
                outputError("security error (CORS) for resource " + getSrc(resource) + ".\nDetails: https://developer.mozilla.org/en/docs/Web/HTML/CORS_enabled_image", options.silent, e);
            }
            return this.prepareResult(value);
        };
        /**
         * Get the average color from a array when 1 pixel is 4 bytes.
         */
        FastAverageColor.prototype.getColorFromArray4 = function (arr, options) {
            options = options || {};
            var bytesPerPixel = 4;
            var arrLength = arr.length;
            var defaultColor = getDefaultColor(options);
            if (arrLength < bytesPerPixel) {
                return defaultColor;
            }
            var len = arrLength - arrLength % bytesPerPixel;
            var step = (options.step || 1) * bytesPerPixel;
            var algorithm;
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
                    throw getError(options.algorithm + " is unknown algorithm.");
            }
            return algorithm(arr, len, {
                defaultColor: defaultColor,
                ignoredColor: prepareIgnoredColor(options.ignoredColor),
                step: step
            });
        };
        /**
         * Get color data from value ([r, g, b, a]).
         */
        FastAverageColor.prototype.prepareResult = function (value) {
            var rgb = value.slice(0, 3);
            var rgba = [value[0], value[1], value[2], value[3] / 255];
            var isDarkColor = isDark(value);
            return {
                value: [value[0], value[1], value[2], value[3]],
                rgb: 'rgb(' + rgb.join(',') + ')',
                rgba: 'rgba(' + rgba.join(',') + ')',
                hex: arrayToHex(rgb),
                hexa: arrayToHex(value),
                isDark: isDarkColor,
                isLight: !isDarkColor
            };
        };
        /**
         * Destroy the instance.
         */
        FastAverageColor.prototype.destroy = function () {
            this.canvas = null;
            this.ctx = null;
        };
        FastAverageColor.prototype.bindImageEvents = function (resource, options) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var onload = function () {
                    unbindEvents();
                    var result = _this.getColor(resource, options);
                    if (result.error) {
                        reject(result.error);
                    }
                    else {
                        resolve(result);
                    }
                };
                var onerror = function () {
                    unbindEvents();
                    reject(getError("Error loading image \"" + resource.src + "\"."));
                };
                var onabort = function () {
                    unbindEvents();
                    reject(getError("Image \"" + resource.src + "\" loading aborted."));
                };
                var unbindEvents = function () {
                    resource.removeEventListener('load', onload);
                    resource.removeEventListener('error', onerror);
                    resource.removeEventListener('abort', onabort);
                };
                resource.addEventListener('load', onload);
                resource.addEventListener('error', onerror);
                resource.addEventListener('abort', onabort);
            });
        };
        return FastAverageColor;
    }());

    return FastAverageColor;

}));
