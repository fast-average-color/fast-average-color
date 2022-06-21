# Using

## Install
```
npm i fast-average-color
```

### Browser
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
    <script src="https://unpkg.com/fast-average-color/dist/index.browser.min.js"></script>
    <script>
        const fac = new FastAverageColor();
        const container = document.querySelector('.image-container');

        fac.getColorAsync(container.querySelector('img'))
            .then(color => {
                container.style.backgroundColor = color.rgba;
                container.style.color = color.isDark ? '#fff' : '#000';
            })
            .catch(e => {
                console.log(e);
            });
    </script>
</body>
</html>
```

## CommonJS
```js
'use strict';

const FastAverageColor = require('fast-average-color').FastAverageColor;
const fac = new FastAverageColor();
fac.getColorAsync(container.querySelector('img'))
    .then(color => {
        container.style.backgroundColor = color.rgba;
        container.style.color = color.isDark ? '#fff' : '#000';
    })
    .catch(e => {
        console.log(e);
    });
```

## ES Modules or TypeScript
```js
import { FastAverageColor } from 'fast-average-color';

const fac = new FastAverageColor();
fac.getColorAsync(container.querySelector('img'))
    .then(color => {
        container.style.backgroundColor = color.rgba;
        container.style.color = color.isDark ? '#fff' : '#000';
    })
    .catch(e => {
        console.log(e);
    });
```

## [Node.js](https://github.com/fast-average-color/fast-average-color-node/)
Use [fast-average-color-node](https://github.com/fast-average-color/fast-average-color-node/) package.
