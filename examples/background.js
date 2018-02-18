window.addEventListener('load', function() {
    var
        ac = new FastAverageColor(),
        items = document.querySelectorAll('.item');

    for (var i = 0; i < items.length; i++) {
        var
            item = items[i],
            color = ac.getColor(item.querySelector('img'));

        item.style.backgroundColor = color.rgb;
        item.style.color = color.isDark ? 'white' : 'black';
    }
}, false);
