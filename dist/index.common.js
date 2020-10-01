/*! Fast Average Color | © 2020 Denis Seleznev | MIT License | https://github.com/fast-average-color/fast-average-color */
'use strict';

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

function isIgnoredColor(arr, num, ignoredColor) {
  return arr[num] === ignoredColor[0] && // red
  arr[num + 1] === ignoredColor[1] && // green
  arr[num + 2] === ignoredColor[2] && // blue
  arr[num + 3] === ignoredColor[3]; // alpha
}

function dominantAlgorithm(arr, len, options) {
  var colorHash = {};
  var divider = 24;
  var ignoredColor = options.ignoredColor;

  for (var i = 0; i < len; i += options.step) {
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
  }

  var buffer = Object.keys(colorHash).map(function (key) {
    return colorHash[key];
  }).sort(function (a, b) {
    var countA = a[4];
    var countB = b[4];
    return countA > countB ? -1 : countA === countB ? 0 : 1;
  });
  var max = buffer[0];
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

  for (var i = 0; i < len; i += options.step) {
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

  for (var i = 0; i < len; i += options.step) {
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

var ERROR_PREFIX = 'FastAverageColor: ';

var FastAverageColor = /*#__PURE__*/function () {
  function FastAverageColor() {
    _classCallCheck(this, FastAverageColor);
  }

  _createClass(FastAverageColor, [{
    key: "getColorAsync",

    /**
     * Get asynchronously the average color from not loaded image.
     *
     * @param {HTMLImageElement | string | null} resource
     * @param {Object} [options]
     * @param {Array}  [options.defaultColor=[0, 0, 0, 0]] [red, green, blue, alpha]
     * @param {Array}  [options.ignoredColor] [red, green, blue, alpha]
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
    value: function getColorAsync(resource, options) {
      if (!resource) {
        return Promise.reject(Error("".concat(ERROR_PREFIX, "call .getColorAsync() without resource.")));
      } else if (typeof resource === 'string') {
        var img = new Image();
        img.crossOrigin = '';
        img.src = resource;
        return this._bindImageEvents(img, options);
      } else if (resource.complete) {
        var result = this.getColor(resource, options);
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
     * @param {Array}  [options.defaultColor=[0, 0, 0, 0]] [red, green, blue, alpha]
     * @param {Array}  [options.ignoredColor] [red, green, blue, alpha]
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

  }, {
    key: "getColor",
    value: function getColor(resource, options) {
      options = options || {};

      var defaultColor = this._getDefaultColor(options);

      var value = defaultColor;

      if (!resource) {
        this._outputError(options, 'call .getColor(null) without resource.');

        return this._prepareResult(defaultColor);
      }

      var originalSize = this._getOriginalSize(resource);

      var size = this._prepareSizeAndPosition(originalSize, options);

      if (!size.srcWidth || !size.srcHeight || !size.destWidth || !size.destHeight) {
        this._outputError(options, "incorrect sizes for resource \"".concat(resource.src, "\"."));

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

        this._ctx.drawImage(resource, size.srcLeft, size.srcTop, size.srcWidth, size.srcHeight, 0, 0, size.destWidth, size.destHeight);

        var bitmapData = this._ctx.getImageData(0, 0, size.destWidth, size.destHeight).data;

        value = this.getColorFromArray4(bitmapData, options);
      } catch (e) {
        this._outputError(options, "security error (CORS) for resource ".concat(resource.src, ".\nDetails: https://developer.mozilla.org/en/docs/Web/HTML/CORS_enabled_image"), e);
      }

      return this._prepareResult(value);
    }
    /**
     * Get the average color from a array when 1 pixel is 4 bytes.
     *
     * @param {Array|Uint8Array} arr
     * @param {Object} [options]
     * @param {string} [options.algorithm="sqrt"] "simple", "sqrt" or "dominant"
     * @param {Array}  [options.defaultColor=[0, 0, 0, 0]] [red, green, blue, alpha]
     * @param {Array}  [options.ignoredColor] [red, green, blue, alpha]
     * @param {number} [options.step=1]
     *
     * @returns {Array} [red (0-255), green (0-255), blue (0-255), alpha (0-255)]
     */

  }, {
    key: "getColorFromArray4",
    value: function getColorFromArray4(arr, options) {
      options = options || {};
      var bytesPerPixel = 4;
      var arrLength = arr.length;

      var defaultColor = this._getDefaultColor(options);

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
          throw Error("".concat(ERROR_PREFIX).concat(options.algorithm, " is unknown algorithm."));
      }

      return algorithm(arr, len, {
        defaultColor: defaultColor,
        ignoredColor: options.ignoredColor,
        step: step
      });
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
    key: "_getDefaultColor",
    value: function _getDefaultColor(options) {
      return this._getOption(options, 'defaultColor', [0, 0, 0, 0]);
    }
  }, {
    key: "_getOption",
    value: function _getOption(options, name, defaultValue) {
      return typeof options[name] === 'undefined' ? defaultValue : options[name];
    }
  }, {
    key: "_prepareSizeAndPosition",
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

      var maxSize = 100;
      var minSize = 10;
      var factor;

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
          reject(Error("".concat(ERROR_PREFIX, "Error loading image ").concat(resource.src, ".")));
        };

        var onabort = function onabort() {
          unbindEvents();
          reject(Error("".concat(ERROR_PREFIX, "Image \"").concat(resource.src, "\" loading aborted.")));
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
  }, {
    key: "_prepareResult",
    value: function _prepareResult(value) {
      var rgb = value.slice(0, 3);
      var rgba = [].concat(rgb, value[3] / 255);

      var isDark = this._isDark(value);

      return {
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
    key: "_getOriginalSize",
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
    key: "_toHex",
    value: function _toHex(num) {
      var str = num.toString(16);
      return str.length === 1 ? '0' + str : str;
    }
  }, {
    key: "_arrayToHex",
    value: function _arrayToHex(arr) {
      return '#' + arr.map(this._toHex).join('');
    }
  }, {
    key: "_isDark",
    value: function _isDark(color) {
      // http://www.w3.org/TR/AERT#color-contrast
      var result = (color[0] * 299 + color[1] * 587 + color[2] * 114) / 1000;
      return result < 128;
    }
  }, {
    key: "_makeCanvas",
    value: function _makeCanvas() {
      return typeof window === 'undefined' ? new OffscreenCanvas(1, 1) : document.createElement('canvas');
    }
  }, {
    key: "_outputError",
    value: function _outputError(options, error, details) {
      if (!options.silent) {
        console.error("".concat(ERROR_PREFIX).concat(error));

        if (details) {
          console.error(details);
        }
      }
    }
  }]);

  return FastAverageColor;
}();

module.exports = FastAverageColor;
