window.addEventListener('load', function() {
    var
        ac = new FastAverageColor(),
        items = document.querySelectorAll('.item');

    for (var i = 0; i < items.length; i++) {
        var
            item = items[i],
            image = item.querySelector('img'),
            size = 50,
            width = image.naturalWidth,
            height = image.naturalHeight,
            colorTop = ac.getColorSync(image, {height: size}),
            colorRight = ac.getColorSync(image, {left: width - size, width: size}),
            colorLeft = ac.getColorSync(image, {width: size}),
            colorBottom = ac.getColorSync(image, {top: height - size, height: size}),
            radius = ' 90px ',
            delta = '70px'

        image.style.boxShadow = [
            '0 -{delta} {radius} ' + colorTop.rgb,
            '{delta} 0 {radius} ' + colorRight.rgb,
            '0 {delta} {radius} ' + colorBottom.rgb,
            '-{delta} 0 {radius} ' + colorLeft.rgb
        ]
            .join(', ')
            .replace(/\{delta\}/g, delta)
            .replace(/\{radius\}/g, radius);

        item.style.color = colorBottom.isDark ? 'white' : 'black';
    }
}, false);
