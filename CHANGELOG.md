# Changelog

# v5.2.1
Update dev deps in package.json.

# v5.2.0
- Fixes for typings
- Add `index.esm.js` and `index.common.js` in `/dist`
- Add a check when resource is null

# v5.1.0
- Add module property in package.json
- Detailed error output

# v5.0.0.
- `getColorAsync()` with Promise, callbacks removed.
Before:
```js
fac.getColorAsync(image, function(color) {
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
}, { algorithm: 'dominant' });
```

After:
```js
fac.getColorAsync(image, { algorithm: 'dominant' }).then((color) => {
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
});
```

# v4.3.0
- Added OffScreenCanvas support @2xAA.

# v4.2.0
- Added dominant algorithm.

# v4.1.1
Fixes for `.getColorAsync()` method.

# v4.1.0
- Fixed bugs in algorithms #12 (thanks @AngReload).
- Added typings for TypeScript.

# v4.0.1
- `/examples` moved to separate [repo](https://github.com/fast-average-color/examples).

# v4.0.0
- `.getColorFromUnloadedImage()` → `.getColorAsync()`.
- Small fixes for examples.

# v3.0.0
- Added `algorithm` property with values `simple` or `sqrt`. Default: `sqrt`.
- Changed parameters in `getColorFromArray4()` method.
- Removed `getColorFromArray3()` method.

# v2.3.0
Improvements in the definition of dark color.

# v2.2.0
Improvements in the algorithm.

# v2.1.0
- Add tests
- Fix jsDoc
- Update devDependencies

# v2.0.0
Added modes: `speed` and `precision`. Speed by default.
```
const fac = new FastAverageColor(image, {mode: 'precision'});
```
Added examples:
- [Box shadow, 4 sides](https://hcodes.github.io/fast-average-color/examples/box-shadow-4-sides.html)
- [Gradient](https://hcodes.github.io/fast-average-color/examples/gradient.html)
- [Ambilight](https://hcodes.github.io/fast-average-color/examples/ambilight.html)
- [Define the average color for your images](https://hcodes.github.io/fast-average-color/examples/define.html)

Added support for HTMLVideoElement.

Changed methods:
- `.getColorSync()` → `.getColor()`
- `.getColor()` → `.Image()`

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
