# API
## `.getColor(resource, [options])`
```js
/**
 * Get synchronously the average color from images, videos and canvas.
 *
 * @param {HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | null} resource
 * @param {Object} [options]
 * @param {number[]}  [options.defaultColor=[0, 0, 0, 0]]
 * @param {number[] | number[][]}  [options.ignoredColor] [red (0-255), green (0-255), blue (0-255), alpha (0-255)]
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
color = fac.getColor(image);

// From loaded image with default color
color = fac.getColor({
    defaultColor: [255, 0, 0, 255] // red
});

// From loaded image with ignored color
// For example, to ignore the white background in logos
color = fac.getColor({
    ignoredColor: [255, 255, 255, 255] // white
});


// From loaded image with precision
// Modes: 'speed' (by default) or 'precision'.
color = fac.getColor({
    mode: 'precision'
});

// From canvas (HTMLCanvasElement)
color = fac.getColor(canvas);

// From video (HTMLVideoElement)
color = fac.getColor(video);
```

## `.getColorAsync(resource, [options])`
```js
/**
 * Get asynchronously the average color from not loaded image.
 *
 * @param {HTMLImageElement | string | null} resource
 * @param {Object} [options]
 * @param {Array}  [options.defaultColor=[0, 0, 0, 0]]
 * @param {Array}  [options.ignoredColor] [red (0-255), green (0-255), blue (0-255), alpha (0-255)]
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
const fac = new FastAverageColor();

// From not loaded image (HTMLImageElement)
fac.getColorAsync(image, { algorithm: 'dominant' })
    .then(color => {
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
    .catch(e => {
        console.error(e);
    });
```

## `.getColorFromArray4(arr, [options])`
```js
/**
 * Get the average color from a array when 1 pixel is 4 bytes.
 *
 * @param {Array|Uint8Array|Uint8ClampedArray} arr
 * @param {Object} [options]
 * @param {string} [options.algorithm="sqrt"] "simple", "sqrt" or "dominant"
 * @param {Array}  [options.defaultColor=[255, 255, 255, 255]]
 * @param {Array}  [options.ignoredColor] [red (0-255), green (0-255), blue (0-255), alpha (0-255)]
 * @param {number} [options.step=1]
 *
 * @returns {Array} [red (0-255), green (0-255), blue (0-255), alpha (0-255)]
 */
```

Get the average color from a array when 1 pixel is 4 bytes.
```js
const fac = new FastAverageColor();
const buffer = [
    // red, green, blue, alpha
    200, 200, 200, 255,
    100, 100, 100, 255
];
const color = fac.getColorFromArray4(buffer);
console.log(color);
// [150, 150, 150, 255]
```


## `.destroy()`
```js
const fac = new FastAverageColor();
const color = fac.getColor(document.querySelector('img'));

//...

// The instance is no longer needed.
fac.destroy();
```
