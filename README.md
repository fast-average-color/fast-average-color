# Fast Average Color
[![NPM version](https://img.shields.io/npm/v/fast-average-color.svg)](https://www.npmjs.com/package/fast-average-color)
[![NPM Downloads](https://img.shields.io/npm/dm/fast-average-color.svg?style=flat)](https://www.npmjs.org/package/fast-average-color)
[![Dependency Status](https://img.shields.io/david/fast-average-color/fast-average-color.svg)](https://david-dm.org/fast-average-color/fast-average-color)
[![Build Status](https://img.shields.io/travis/fast-average-color/fast-average-color.svg?style=flat)](https://travis-ci.org/fast-average-color/fast-average-color)
[![bundlephobia](https://badgen.net/bundlephobia/minzip/fast-average-color)](https://bundlephobia.com/result?p=fast-average-color)

A simple library that calculates the average color of any images or videos in browser environment.
<img width="100%" style="max-width: 640px;" src="https://raw.githubusercontent.com/fast-average-color/fast-average-color/master/img/title.png" />

## [Examples](https://fast-average-color.github.io/examples/background.html)
- [Background](https://fast-average-color.github.io/examples/background.html)
- [Box shadow](https://fast-average-color.github.io/examples/box-shadow.html)
- [Box shadow, 4 sides](https://fast-average-color.github.io/examples/box-shadow-4-sides.html)
- [Border](https://fast-average-color.github.io/examples/border.html)
- [Gallery](https://fast-average-color.github.io/examples/gallery.html)
- [Gradient](https://fast-average-color.github.io/examples/gradient.html)
- [Gradient as stripes](https://fast-average-color.github.io/examples/gradient_stripes.html)
- [Canvas](https://fast-average-color.github.io/examples/canvas.html)
- [Text photo](https://fast-average-color.github.io/examples/text-photo.html)
- [Ambilight](https://fast-average-color.github.io/examples/ambilight.html)
- [Define the average color for your images](https://fast-average-color.github.io/examples/define.html)

[See code](https://github.com/fast-average-color/examples)

## [Storing an image from a foreign origin](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image#Storing_an_image_from_a_foreign_origin)

## Using
```
npm i fast-average-color
```

### Simple
```html
<html>
<body>
    ...
    <div class="image-container">
        <img src="image.png" />
        <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit,
            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </div>
    </div>
    <script src="https://unpkg.com/fast-average-color/dist/index.min.js"></script>
    <script>
        const
            container = document.querySelector('.image-container'),
            color = FastAverageColor.getColor(container.querySelector('img'));

        container.style.backgroundColor = color.rgba;
        container.style.color = color.isDark ? '#fff' : '#000';

        console.log(color);
        // {
        //     error: null,
        //     rgb: 'rgb(255, 0, 0)',
        //     rgba: 'rgba(255, 0, 0, 1)',
        //     hex: '#ff0000',
        //     hexa: '#ff0000ff',
        //     value: [255, 0, 0, 255],
        //     isDark: true,
        //     isLight: false
        // }
    </script>
</body>
</html>
```

or

```html
<html>
<body>
    ...
    <div class="image-container">
        <img src="image.png" />
        <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit,
            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </div>
    </div>
    <script src="https://unpkg.com/fast-average-color/dist/index.min.js"></script>
    <script>
        var container = document.querySelector('.image-container');

        FastAverageColor.getColor(container.querySelector('img'))
            .then(function(color) {
                container.style.backgroundColor = color.rgba;
                container.style.color = color.isDark ? '#fff' : '#000';
            })
            .catch(function(e) {
                console.error(e);
            });
    </script>
</body>
</html>
```

### CommonJS
[Details](./dist/README.md)

```js
'use strict';

const FastAverageColor = require('fast-average-color');
FastAverageColor.getColor(document.querySelector('img'))
    .then((color) => {
        console.log(color);
    })
    .catch((e) => {
        console.error(e);
    });
```

### ES Modules
[Details](./dist/README.md)

```js
import { getColor } from 'fast-average-color';

getColor(document.querySelector('img'))
    .then((result) => {
        console.log(result);
    })
    .catch((e) => {
        console.error(e);
    });
```

## API
### `.getColorSync(resource, [options])`
```js
/**
 * Get synchronously the average color from images, videos and canvas.
 *
 * @param {HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | null} resource
 * @param {Object} [options]
 * @param {Array}  [options.defaultColor=[255, 255, 255, 255]]
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
```

Get the average color from a resource (loaded images, videos or canvas).

```js
const fac = new FastAverageColor();
let color;

// From loaded image (HTMLImageElement)
color = FastAverageColor.getColorSync(image);

// From loaded image with default color
color = FastAverageColor.getColorSync({
    // Set default color - red.
    defaultColor: [255, 0, 0, 255]
});

// From loaded image with precision
color = fac.getColorSync({
    // Modes: 'speed' (by default) or 'precision'.
    // Current mode is precision.
    mode: 'precision'
});

// From canvas (HTMLCanvasElement)
color = fac.getColorSync(canvas);

// From video (HTMLVideoElement)
color = fac.getColorSync(video);
```

### `.getColor(resource, [options])`
```js
/**
 * Get asynchronously the average color from not loaded image.
 *
 * @param {HTMLImageElement | null} resource
 * @param {Object} [options]
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
```
Get asynchronously the average color from a resource (not loaded images, videos or canvas).
```js
// From not loaded image (HTMLImageElement)
FastAverageColor.getColor(image, { algorithm: 'dominant' })
    .then((color) => {
        console.log(color);
        // {
        //     rgb: 'rgb(255, 0, 0)',
        //     rgba: 'rgba(255, 0, 0, 1)',
        //     hex: '#ff0000',
        //     hexa: '#ff0000ff',
        //     value: [255, 0, 0, 255],
        //     isDark: true,
        //     isLight: false
        // }
    })
    .catch(function(e) {
        console.error(e);
    });
```

### `.getColorFromArray4(array, options)`
```js
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
```

Get the average color from a array when 1 pixel is 4 bytes.
```js
const buffer = [
    // red, green, blue, alpha
    200, 200, 200, 255,
    100, 100, 100, 255
];
const color = FastAverageColor.getColorFromArray4(buffer);
console.log(color);
// [150, 150, 150, 255]
```


### `.removeCanvas()`
```js
const color = FastAverageColor.getColor(document.querySelector('img'));

//...

// Avoid memory.
FastAverageColor.removeCanvas();
```

## Algorithms
- `simple`
- `sqrt` (default)
- `dominant`

[Comparison of algorithms for photos](https://fast-average-color.github.io/examples/algorithms.html)
[Comparison of algorithms for 2 colors](https://fast-average-color.github.io/compare/)

```js
const fac = new FastAverageColor();
console.log(fac.getColor(image, {algorithm: 'dominant'});
```

## [Different Builds](./dist/README.md)

## Development
```
git clone git@github.com:fast-average-color/fast-average-color.git ./fast-average-color
cd ./fast-average-color

npm i
npm test
```

## [License](LICENSE)
MIT License
