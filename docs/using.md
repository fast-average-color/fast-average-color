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
    <script src="https://unpkg.com/fast-average-color/dist/index.min.js"></script>
    <script>
        var
            fac = new FastAverageColor(),
            container = document.querySelector('.image-container');

        fac.getColorAsync(container.querySelector('img'))
            .then(function(color) {
                container.style.backgroundColor = color.rgba;
                container.style.color = color.isDark ? '#fff' : '#000';
            })
            .catch(function(e) {
                console.log(e);
            });
    </script>
</body>
</html>
```

## CommonJS
[Details](../dist/README.md)

```js
'use strict';

const FastAverageColor = require('fast-average-color');
const fac = new FastAverageColor();
fac.getColorAsync(container.querySelector('img'))
    .then(function(color) {
        container.style.backgroundColor = color.rgba;
        container.style.color = color.isDark ? '#fff' : '#000';
    })
    .catch(function(e) {
        console.log(e);
    });
```

## ES Modules or TypeScript
[Details](../dist/README.md)

```js
import FastAverageColor from 'fast-average-color';

const fac = new FastAverageColor();
fac.getColorAsync(container.querySelector('img'))
    .then(function(color) {
        container.style.backgroundColor = color.rgba;
        container.style.color = color.isDark ? '#fff' : '#000';
    })
    .catch(function(e) {
        console.log(e);
    });
```

## Node.js
[Example](https://github.com/fast-average-color/examples/blob/master/nodejs/index.js)
