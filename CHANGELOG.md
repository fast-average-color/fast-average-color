# Changelog

# v2.0.0
Added modes: `speed` or `precision`. Speed by default.
```
const fac = new FastAverageColor(image, {mode: 'precision'});
```
Added examples:
- [Box shadow, 4 sides](https://hcodes.github.io/fast-average-color/examples/box-shadow-4-sides.html)
- [Gradient](https://hcodes.github.io/fast-average-color/examples/gradient.html)
- [Video](https://hcodes.github.io/fast-average-color/examples/video.html)
- [Define the average color for your images](https://hcodes.github.io/fast-average-color/examples/define.html)

Added support for HTMLVideoElement.

Changed methods:
- `.getColorSync()` → `.getColor()`
- `.getColor()` → `.getColorFromUnloadedImage()`

# v1.0.1
Fixed errors in the algorithm.

# v1.0.0
Added:
- `.getColorFromArray3()`
- `.getColorFromArray4()`

Changed:
- `.get()` → `.getColor()`
- `.getSync()` → `.getColorSync()`

Added the example for canvas.
Updated README.

# v0.1.0
First public release.
