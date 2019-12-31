# Fast Average Color
[![NPM version](https://img.shields.io/npm/v/fast-average-color.svg)](https://www.npmjs.com/package/fast-average-color)
[![NPM Downloads](https://img.shields.io/npm/dm/fast-average-color.svg?style=flat)](https://www.npmjs.org/package/fast-average-color)
[![Dependency Status](https://img.shields.io/david/fast-average-color/fast-average-color.svg)](https://david-dm.org/fast-average-color/fast-average-color)
[![Build Status](https://img.shields.io/travis/fast-average-color/fast-average-color.svg?style=flat)](https://travis-ci.org/fast-average-color/fast-average-color)
[![bundlephobia](https://badgen.net/bundlephobia/minzip/fast-average-color)](https://bundlephobia.com/result?p=fast-average-color)

A simple library that calculates the average color of any images or videos in browser environment.
<img width="100%" style="max-width: 640px;" src="https://raw.githubusercontent.com/fast-average-color/fast-average-color/master/img/title.png" />

## Table of contents
- [Storing an image from a foreign origin](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image#Storing_an_image_from_a_foreign_origin)
- [Using](./docs/using.md)
  + [Install](./docs/using.md)
  + [CommonJS](./docs/using.md#commonjs)
  + [ES Modules](./docs/using.md#es-modules)
  + [TypeScript](./docs/using.md-typescript)
  + Get average color
    - [from loaded image](./docs/using.md#from-loaded-image)
    - [from unloaded image](./docs/using.md#from-unloaded-image)
    - [from image url](./docs/using.md#from-image-url)
- [API](./docs/api.md)
  + [.getColor(resource, [options])](./docs/api.md#getcolorresource-options)
  + [.getColorAsync()](./docs/api.md#getcolorasyncresource-options)
  + [.getColorFromArray4(array, options)](./docs/api.md#getcolorfromarray4resource-options)
  + [.destroy()](./docs/api.md#destroy)
- [Examples](https://fast-average-color.github.io/examples/background.html) [See code](https://github.com/fast-average-color/examples)
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
- [Different Builds](./dist/README.md)
- [Development](./docs/development.md)

## [License](LICENSE)
MIT License
