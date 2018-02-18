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
            colorTop = ac.getColor(image, {height: size}),
            colorRight = ac.getColor(image, {left: width - size, width: size}),
            colorLeft = ac.getColor(image, {width: size}),
            colorBottom = ac.getColor(image, {top: height - size, height: size}),
            radius = ' 90px ',
            delta = '70px';

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
