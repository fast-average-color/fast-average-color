# Fast Average Color
[![NPM version](https://img.shields.io/npm/v/fast-average-color.svg)](https://www.npmjs.com/package/fast-average-color)
[![NPM Downloads](https://img.shields.io/npm/dm/fast-average-color.svg?style=flat)](https://www.npmjs.org/package/fast-average-color)
[![Dependency Status](https://img.shields.io/david/fast-average-color/fast-average-color.svg)](https://david-dm.org/fast-average-color/fast-average-color)
[![bundlephobia](https://badgen.net/bundlephobia/minzip/fast-average-color)](https://bundlephobia.com/result?p=fast-average-color)

A simple library that calculates the average color of any images or videos in browser environment.
<img width="100%" style="max-width: 640px;" src="https://raw.githubusercontent.com/fast-average-color/fast-average-color/master/img/title.png" />

## Features
- Bet on speed
- Some algorithms: simple, sqrt (default) and dominant
- Small bundle size, tree shaking
- Average color can be obtained from:
  + image
  + string (url of image)
  + video
  + canvas
  + array of numbers, `Uint8Array` or `Uint8ClampedArray`
- Average color can be obtained from specific part of resource
- Support for transparency (PNG, SVG and other formats)
- Support for web workers
- [Support for Node.js](https://github.com/fast-average-color/fast-average-color-node/)

## Table of contents
- [Using](./docs/using.md)
  + [Install](./docs/using.md)
  + [CommonJS](./docs/using.md#commonjs)
  + [ES Modules or TypeScript](./docs/using.md#es-modules-or-typescript)
  + [Node.js](./docs/using.md#nodejs)
- [Examples](./docs/examples.md)
  + [Get average color from loaded image](./docs/examples.md#from-loaded-image)
  + [Get average color from unloaded image](./docs/examples.md#from-unloaded-image)
  + [Get average color from image url](./docs/examples.md#from-image-url)
- [Algorithms](./docs/algorithms.md)
- [API](./docs/api.md)
  + [.getColor(resource, [options])](./docs/api.md#getcolorresource-options)
  + [.getColorAsync(resource, [options])](./docs/api.md#getcolorasyncresource-options)
  + [.getColorFromArray4(arr, [options])](./docs/api.md#getcolorfromarray4arr-options)
  + [.destroy()](./docs/api.md#destroy)
- [Storing an image from a foreign origin](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image#Storing_an_image_from_a_foreign_origin)
- [Different Builds](./dist/README.md)
- [Development](./docs/development.md)

## [More examples](https://fast-average-color.github.io/examples/background.html)
  + [Background](https://fast-average-color.github.io/examples/background.html)
  + [Box shadow](https://fast-average-color.github.io/examples/box-shadow.html)
  + [Box shadow, 4 sides](https://fast-average-color.github.io/examples/box-shadow-4-sides.html)
  + [Border](https://fast-average-color.github.io/examples/border.html)
  + [Gallery](https://fast-average-color.github.io/examples/gallery.html)
  + [Gradient](https://fast-average-color.github.io/examples/gradient.html)
  + [Gradient as stripes](https://fast-average-color.github.io/examples/gradient_stripes.html)
  + [Canvas](https://fast-average-color.github.io/examples/canvas.html)
  + [Text photo](https://fast-average-color.github.io/examples/text-photo.html)
  + [Ambilight](https://fast-average-color.github.io/examples/ambilight.html)
  + [Define the average color for your images](https://fast-average-color.github.io/examples/define.html)

[See code](https://github.com/fast-average-color/examples)

## [License](LICENSE)
MIT License

## Links
- [fast-average-color-node](https://github.com/fast-average-color/fast-average-color-node/)
