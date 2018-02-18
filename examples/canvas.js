window.addEventListener('load', function() {
    var fac = new FastAverageColor(),
        canvas = document.querySelector('canvas'),
        ctx = canvas.getContext('2d'),
        width = canvas.width,
        height = canvas.height,
        info = document.querySelector('.info'),
        infoColor = document.querySelector('.info__color'),
        rnd = function(max) {
            return Math.random() * max;
        },
        rndFloor = function(max) {
            return Math.floor(Math.random() * max);
        },
        timer,
        stoped = false,
        isPrecision = false;

    function start() {
        timer = setInterval(function() {
            ctx.fillStyle = 'rgba(' + [
                rndFloor(255),
                rndFloor(255),
                rndFloor(255),
                rnd(1)
            ].join(',') + ')';

            ctx.fillRect(rnd(width), rnd(height), rnd(width), rnd(height));

            var timeA = Date.now(),
                color = fac.getColor(canvas, {mode: isPrecision ? 'precision' : 'speed'});

            info.style.backgroundColor = color.rgba;
            infoColor.innerHTML = [
                'rgb: ' + color.rgb,
                'rgba: ' + color.rgba,
                'hex: ' + color.hex,
                'hexa: ' + color.hexa,
                'time: ' + (Date.now() - timeA) + ' ms'
            ].map(function(item) {
                return '<div class="info__item">' + item + '</div>';
            }).join('');
        }, 50);
    }

    document.querySelector('button').onclick = function() {
        stoped = !stoped;
        if (stoped) {
            this.innerHTML = 'Start!';
            clearInterval(timer);
        } else {
            this.innerHTML = 'Stop';
            start();
        }
    };

    start();
}, false);
