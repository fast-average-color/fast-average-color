## Explanation of Build Files

| UMD | CommonJS | ES Module |
| --- | --- | --- |
| index.js | index.common.js | index.esm.js |

### Terms

- **[UMD](https://github.com/umdjs/umd)**: UMD builds can be used directly in the browser via a `<script>` tag. The default file from Unpkg CDN at [https://unpkg.com/fast-average-color](https://unpkg.com/fast-average-color) `index.js`.

- **[CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1)**: CommonJS builds are intended for use with older bundlers like [browserify](http://browserify.org/) or [webpack 1](https://webpack.github.io). The default file for these bundlers (`pkg.main`) is the Runtime only CommonJS build (`index.common.js`).

- **[ES Module](http://exploringjs.com/es6/ch_modules.html)**: ES module builds are intended for use with modern bundlers like [webpack 2](https://webpack.js.org) or [rollup](http://rollupjs.org/). The default file for these bundlers (`pkg.module`) is the Runtime only ES Module build (`index.esm.js`).

#### Webpack

``` js
module.exports = {
  // ...
  resolve: {
    alias: {
      'fast-average-color': 'fast-average-color/dist/index.esm.js' // 'fast-average-color/dist/index.common.js' for webpack 1
    }
  }
}
```

#### Rollup

``` js
const alias = require('rollup-plugin-alias')

rollup({
  // ...
  plugins: [
    alias({
      'fast-average-color': 'fast-average-color/dist/index.esm.js'
    })
  ]
})
```

#### Browserify

Add to your project's `package.json`:

``` js
{
  // ...
  "browser": {
    "fast-average-color": "fast-average-color/dist/index.common.js"
  }
}
```
