/*! Fast Average Color | © 2021 Denis Seleznev | MIT License | https://github.com/fast-average-color/fast-average-color */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.FastAverageColor = factory());
}(this, function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

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
      return color;
    }

    if (Array.isArray(color)) {
      return typeof color[0] === 'number' ? [color.slice()] : color;
    }

    return [color];
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

    if (data[index] === ignoredColor[0] && data[index + 1] === ignoredColor[1] && data[index + 2] === ignoredColor[2]) {
      return true;
    }

    return false;
  }

  function isIgnoredRGBAColor(data, index, ignoredColor) {
    if (data[index + 3] && ignoredColor[3]) {
      return data[index] === ignoredColor[0] && data[index + 1] === ignoredColor[1] && data[index + 2] === ignoredColor[2] && data[index + 3] === ignoredColor[3];
    } // Ignore rgb components if the pixel are fully transparent.


    return data[index + 3] === ignoredColor[3];
  }

  function inRange(colorComponent, ignoredColorComponent, value) {
    return colorComponent >= ignoredColorComponent - value && colorComponent <= ignoredColorComponent + value;
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

    if (inRange(data[index], redIgnored, threshold) && inRange(data[index + 1], greenIgnored, threshold) && inRange(data[index + 2], blueIgnored, threshold) && alphaInRange) {
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

      var key = Math.round(red / divider) + ',' + Math.round(green / divider) + ',' + Math.round(blue / divider);

      if (colorHash[key]) {
        colorHash[key] = [colorHash[key][0] + red * alpha, colorHash[key][1] + green * alpha, colorHash[key][2] + blue * alpha, colorHash[key][3] + alpha, colorHash[key][4] + 1];
      } else {
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
    return alphaTotal ? [Math.round(redTotal / alphaTotal), Math.round(greenTotal / alphaTotal), Math.round(blueTotal / alphaTotal), Math.round(alphaTotal / count)] : options.defaultColor;
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

    return alphaTotal ? [Math.round(redTotal / alphaTotal), Math.round(greenTotal / alphaTotal), Math.round(blueTotal / alphaTotal), Math.round(alphaTotal / count)] : options.defaultColor;
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

    return alphaTotal ? [Math.round(Math.sqrt(redTotal / alphaTotal)), Math.round(Math.sqrt(greenTotal / alphaTotal)), Math.round(Math.sqrt(blueTotal / alphaTotal)), Math.round(alphaTotal / count)] : options.defaultColor;
  }

  function getDefaultColor(options) {
    return getOption(options, 'defaultColor', [0, 0, 0, 0]);
  }
  function getOption(options, name, defaultValue) {
    return typeof options[name] === 'undefined' ? defaultValue : options[name];
  }

  var MIN_SIZE = 10;
  var MAX_SIZE = 100;
  function isSvg(filename) {
    return filename.search(/\.svg(\?|$)/i) !== -1;
  }
  function getOriginalSize(resource) {
    if (resource instanceof HTMLImageElement) {
      var width = resource.naturalWidth;
      var height = resource.naturalHeight; // For SVG images with only viewBox attr.

      if (!resource.naturalWidth && isSvg(resource.src)) {
        width = height = MAX_SIZE;
      }

      return {
        width: width,
        height: height
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
    } else {
      factor = srcHeight / srcWidth;
      destHeight = MAX_SIZE;
      destWidth = Math.round(destHeight / factor);
    }

    if (destWidth > srcWidth || destHeight > srcHeight || destWidth < MIN_SIZE || destHeight < MIN_SIZE) {
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
    return typeof window === 'undefined' ? new OffscreenCanvas(1, 1) : document.createElement('canvas');
  }

  var ERROR_PREFIX = 'FastAverageColor: ';
  function outputError(options, text, details) {
    if (!options.silent) {
      console.error(ERROR_PREFIX + text);

      if (details) {
        console.error(details);
      }
    }
  }
  function getError(text) {
    return Error(ERROR_PREFIX + text);
  }

  var FastAverageColor = /*#__PURE__*/function () {
    function FastAverageColor() {
      _classCallCheck(this, FastAverageColor);
    }

    _createClass(FastAverageColor, [{
      key: "getColorAsync",
      value:
      /**
       * Get asynchronously the average color from not loaded image.
       *
       * @param {string | HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | null} resource
       * @param {FastAverageColorOptions} [options]
       *
       * @returns {Promise<FastAverageColorOptions>}
       */
      function getColorAsync(resource, options) {
        if (!resource) {
          return Promise.reject(getError('call .getColorAsync() without resource.'));
        }

        if (typeof resource === 'string') {
          var img = new Image();
          img.crossOrigin = '';
          img.src = resource;
          return this._bindImageEvents(img, options);
        } else if (resource instanceof Image && !resource.complete) {
          return this._bindImageEvents(resource, options);
        } else {
          var result = this.getColor(resource, options);
          return result.error ? Promise.reject(result.error) : Promise.resolve(result);
        }
      }
      /**
       * Get the average color from images, videos and canvas.
       *
       * @param {HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | null} resource
       * @param {FastAverageColorOptions} [options]
       *
       * @returns {FastAverageColorResult}
       */

    }, {
      key: "getColor",
      value: function getColor(resource, options) {
        options = options || {};
        var defaultColor = getDefaultColor(options);

        if (!resource) {
          outputError(options, 'call .getColor(null) without resource.');
          return this.prepareResult(defaultColor);
        }

        var originalSize = getOriginalSize(resource);
        var size = prepareSizeAndPosition(originalSize, options);

        if (!size.srcWidth || !size.srcHeight || !size.destWidth || !size.destHeight) {
          outputError(options, "incorrect sizes for resource \"".concat(resource.src, "\"."));
          return this.prepareResult(defaultColor);
        }

        if (!this._ctx) {
          this._canvas = makeCanvas();
          this._ctx = this._canvas.getContext && this._canvas.getContext('2d');

          if (!this._ctx) {
            outputError(options, 'Canvas Context 2D is not supported in this browser.');
            return this.prepareResult(defaultColor);
          }
        }

        this._canvas.width = size.destWidth;
        this._canvas.height = size.destHeight;
        var value = defaultColor;

        try {
          this._ctx.clearRect(0, 0, size.destWidth, size.destHeight);

          this._ctx.drawImage(resource, size.srcLeft, size.srcTop, size.srcWidth, size.srcHeight, 0, 0, size.destWidth, size.destHeight);

          var bitmapData = this._ctx.getImageData(0, 0, size.destWidth, size.destHeight).data;

          value = this.getColorFromArray4(bitmapData, options);
        } catch (e) {
          outputError(options, "security error (CORS) for resource ".concat(resource.src, ".\nDetails: https://developer.mozilla.org/en/docs/Web/HTML/CORS_enabled_image"), e);
        }

        return this.prepareResult(value);
      }
      /**
       * Get the average color from a array when 1 pixel is 4 bytes.
       *
       * @param {number[]|Uint8Array|Uint8ClampedArray} arr
       * @param {Object} [options]
       * @param {string} [options.algorithm="sqrt"] "simple", "sqrt" or "dominant"
       * @param {number[]}  [options.defaultColor=[0, 0, 0, 0]] [red, green, blue, alpha]
       * @param {number[]}  [options.ignoredColor] [red, green, blue, alpha]
       * @param {number} [options.step=1]
       *
       * @returns {number[]} [red (0-255), green (0-255), blue (0-255), alpha (0-255)]
       */

    }, {
      key: "getColorFromArray4",
      value: function getColorFromArray4(arr, options) {
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
            throw getError("".concat(options.algorithm, " is unknown algorithm."));
        }

        return algorithm(arr, len, {
          defaultColor: defaultColor,
          ignoredColor: prepareIgnoredColor(options.ignoredColor),
          step: step
        });
      }
      /**
       * Get color data from value ([r, g, b, a]).
       *
       * @param {number[]} value
       *
       * @returns {FastAverageColorResult}
       */

    }, {
      key: "prepareResult",
      value: function prepareResult(value) {
        var rgb = value.slice(0, 3);
        var rgba = [].concat(rgb, value[3] / 255);
        var isDarkColor = isDark(value);
        return {
          value: value,
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

    }, {
      key: "destroy",
      value: function destroy() {
        delete this._canvas;
        delete this._ctx;
      }
    }, {
      key: "_bindImageEvents",
      value: function _bindImageEvents(resource, options) {
        var _this = this;

        return new Promise(function (resolve, reject) {
          var onload = function onload() {
            unbindEvents();

            var result = _this.getColor(resource, options);

            if (result.error) {
              reject(result.error);
            } else {
              resolve(result);
            }
          };

          var onerror = function onerror() {
            unbindEvents();
            reject(getError("Error loading image \"".concat(resource.src, "\".")));
          };

          var onabort = function onabort() {
            unbindEvents();
            reject(getError("Image \"".concat(resource.src, "\" loading aborted.")));
          };

          var unbindEvents = function unbindEvents() {
            resource.removeEventListener('load', onload);
            resource.removeEventListener('error', onerror);
            resource.removeEventListener('abort', onabort);
          };

          resource.addEventListener('load', onload);
          resource.addEventListener('error', onerror);
          resource.addEventListener('abort', onabort);
        });
      }
    }]);

    return FastAverageColor;
  }();

  return FastAverageColor;

}));
