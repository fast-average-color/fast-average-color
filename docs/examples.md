# Examples

## Get average color from loaded image
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
        window.addEventListener('load', function() {
            const fac = new FastAverageColor();
            const container = document.querySelector('.image-container');
            const color = fac.getColor(container.querySelector('img'));

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
        }, false);
    </script>
</body>
</html>
```

## Get average color from unloaded image
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

## Get average color from image url
```html
...
<script src="https://unpkg.com/fast-average-color/dist/index.browser.min.js"></script>
<script>
    const fac = new FastAverageColor();

    fac.getColorAsync('./image.jpg')
        .then(color => {
            container.style.backgroundColor = color.rgba;
            container.style.color = color.isDark ? '#fff' : '#000';

            console.log('Average color', color);
        })
        .catch(e => {
            console.log(e);
        });
</script>
...
```

## Get average color with ignored color
For example, to ignore white background in logos.

```html
...
<script src="https://unpkg.com/fast-average-color/dist/index.browser.min.js"></script>
<script>
    const fac = new FastAverageColor();

    fac.getColorAsync('./logo.png', {
        ignoredColor: [255, 255, 255, 255] // white
    })
        .then(color => {
            console.log('Average color', color);
        })
        .catch(e => {
            console.log(e);
        });
</script>
...
```

## Get average color with multiple ignored colors
For example, to ignore white and black background in logos.

```html
...
<script src="https://unpkg.com/fast-average-color/dist/index.browser.min.js"></script>
<script>
    const fac = new FastAverageColor();

    fac.getColorAsync('./logo.png', {
        ignoredColor: [
            [255, 255, 255, 255], // white
            [0, 0, 0, 255] // black
        ]
    })
        .then(color => {
            console.log('Average color', color);
        })
        .catch(e => {
            console.log(e);
        });
</script>
...
```
## Get average color with ignored color and threshold
```html
...
<script src="https://unpkg.com/fast-average-color/dist/index.browser.min.js"></script>
<script>
    const fac = new FastAverageColor();

    fac.getColorAsync('./logo.png', {
        ignoredColor: [
            // [red (0-255), green (0-255), blue (0-255), alpha (0-255), treshold (0-255)]
            [255, 0, 100, 255, 5]
        ],
    })
        .then(color => {
            console.log('Average color', color);
        })
        .catch(e => {
            console.log(e);
        });
</script>
...
```



