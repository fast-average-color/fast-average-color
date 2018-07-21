window.addEventListener('load', function() {
    var
        ac = new FastAverageColor({defaultColor: [0, 0, 0, 0]}),
        items = document.querySelectorAll('.item');

    function getGradient(image, padding) {
        var value = 'linear-gradient(to bottom, ';

        var
            naturalHeight = image.naturalHeight,
            height = image.height,
            count = 10,
            naturalHeightPart = Math.floor(naturalHeight / count),
            heightPart = Math.floor(height / count),
            color,
            top,
            bottom,
            parts = [];

        for (var i = 0; i < count; i++) {
            color = ac.getColor(image, {left: 0, top: i * naturalHeightPart, height: naturalHeightPart });
            top = i ? (i * heightPart) + padding : 0;
            bottom = ((i + 1) * heightPart - 1) + padding;
            parts.push(color.rgb + ' ' + top + 'px, ' + color.rgb + ' ' + bottom + 'px');
        }

        value += parts.join(', ');

        value += ')';

        return {
            value: value,
            lastColor: color
        };
    }

    function updateStripes() {
        for (var i = 0; i < items.length; i++) {
            var
                item = items[i],
                image = item.querySelector('img'),
                padding = 30,
                gradient = getGradient(image, padding);

            item.style.background = gradient.value;
            item.style.color = gradient.lastColor.isDark ? 'white' : 'black';
        }
    }

    window.addEventListener('resize', updateStripes, false);

    updateStripes();
}, false);
