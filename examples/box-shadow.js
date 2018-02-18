window.addEventListener('load', function() {
    var
        ac = new FastAverageColor(),
        items = document.querySelectorAll('.item');

    for (var i = 0; i < items.length; i++) {
        var
            item = items[i],
            image = item.querySelector('img'),
            color = ac.getColor(image);

        image.style.boxShadow = '0 70px 90px ' + color.rgb;
        item.style.color = color.isDark ? 'white' : 'black';
    }
}, false);
