window.addEventListener('load', function() {
    var
        ac = new FastAverageColor(),
        items = document.querySelectorAll('.item');

    for (var i = 0; i < items.length; i++) {
        var
            item = items[i],
            image = item.querySelector('img'),
            isBottom = item.classList.contains('item_bottom'),
            gradient = item.querySelector('.item__gradient'),
            height = image.naturalHeight,
            size = 50,
            color = ac.getColor(image, isBottom ? {top: height - size, height: size} : {height: size}),
            colorEnd = [].concat(color.value.slice(0, 3), 0).join(',');

        item.style.background =  color.rgb;
        item.style.color = color.isDark ? 'white' : 'black';

        if (isBottom) {
            gradient.style.background = 'linear-gradient(to bottom, ' +
                'rgba(' + colorEnd + ') 0%, ' + color.rgba + ' 100%)';
        } else {
            gradient.style.background = 'linear-gradient(to top, ' +
                'rgba(' + colorEnd + ') 0%, ' + color.rgba + ' 100%)';
        }
    }
}, false);
