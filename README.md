# Super Fast Average Color
[![NPM version](https://img.shields.io/npm/v/fast-average-color.svg)](https://www.npmjs.com/package/fast-average-color)
[![NPM Downloads](https://img.shields.io/npm/dm/fast-average-color.svg?style=flat)](https://www.npmjs.org/package/fast-average-color)
[![Dependency Status](https://img.shields.io/david/hcodes/fast-average-color.svg)](https://david-dm.org/hcodes/fast-average-color)
[![Build Status](https://img.shields.io/travis/hcodes/fast-average-color.svg?style=flat)](https://travis-ci.org/hcodes/fast-average-color)

## Examples
- [Background](https://hcodes.github.io/fast-average-color/examples/background.html)
- [Box shadow](https://hcodes.github.io/fast-average-color/examples/box-shadow.html)
- [Gallery](https://hcodes.github.io/fast-average-color/examples/gallery.html)

## Using
```
npm i fast-average-color --save-dev
```
or
```
yarn add fast-average-color
```

### Simple
```html
<html>
<body>
    ...
    <img src="image.png" />
    <script src="https://unpkg.com/fast-average-color/dist/index.min.js"></script>
    <script>
        var ac = new FastAverageColor();
        var color = ac.getSync(document.querySelector('img'));
        console.log(color);
        // { 
        //     error: null,
        //     rgb: 'rgb(255, 0, 0)',
        //     rgba: 'rgba(255, 0, 0, 1)',
        //     hex: '#ff0000',
        //     hexa: '#ff0000ff',
        //     value: [255, 0, 0, 1],
        //     isDark: true
        // }
    </script>
</body>
</html>
```

### CommonJS

```js
'use strict';

const FastAverageColor = require('fast-average-color');
const ac = new FastAverageColor({defaultColor: [0, 0, 0, 1]}); // black - default color.
const color = ac.getSync(document.querySelector('img'));

console.log(color);
```

### ES6
```js
'use strict';

import FastAverageColor from 'fast-average-color/dist/index.es6';

const ac = new FastAverageColor({defaultColor: [0, 0, 0, 1]}); // black - default color.
const color = ac.getSync(document.querySelector('img'));

console.log(color);
```

## Different Builds
In the `dist/` directory of [the NPM package](https://unpkg.com/fast-average-color/dist/) you will find many different builds.

|Type              |Filename                 |
|------------------|-------------------------|
|Development       |`index.js`               |
|Production        |`index.min.js`           |
|ES6               |`index.es6.js`           |

## Development
```
git clone git@github.com:hcodes/fast-average-color.git ./fast-average-color
cd ./fast-average-color

npm i
npm run build
npm test

open ./examples/
```

## [License](LICENSE)
MIT License
