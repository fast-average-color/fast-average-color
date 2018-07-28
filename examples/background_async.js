(function() {
    var
        ac = new FastAverageColor(),
        items = document.querySelectorAll('.item');

    for (var i = 0; i < items.length; i++) {
        var item = items[i];

        ac.getColorAsync(item.querySelector('img'), function(color, data) {
            data.item.style.backgroundColor = color.rgb;
            data.item.style.color = color.isDark ? 'white' : 'black';
        }, {
            data: { item: item }
        });
    }
})();
