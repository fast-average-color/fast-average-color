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
    <script src="https://unpkg.com/fast-average-color/dist/index.min.js"></script>
    <script>
        window.addEventListener('load', function() {
            var
                fac = new FastAverageColor(),
                container = document.querySelector('.image-container'),
                color = fac.getColor(container.querySelector('img'));

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

## Get average color from image url
```html
...
<script src="https://unpkg.com/fast-average-color/dist/index.min.js"></script>
<script>
    var fac = new FastAverageColor();

    fac.getColorAsync('./image.jpg')
        .then(function(color) {
            container.style.backgroundColor = color.rgba;
            container.style.color = color.isDark ? '#fff' : '#000';

            console.log('Average color', color);
        })
        .catch(function(e) {
            console.log(e);
        });
</script>
...
```

## Get average color with ignored color
For example, to ignore white background in logos.

```html
...
<script src="https://unpkg.com/fast-average-color/dist/index.min.js"></script>
<script>
    var fac = new FastAverageColor();

    fac.getColorAsync('./logo.png', {
        ignoredColor: [255, 255, 255, 255] // white
    })
        .then(function(color) {
            console.log('Average color', color);
        })
        .catch(function(e) {
            console.log(e);
        });
</script>
...
```
