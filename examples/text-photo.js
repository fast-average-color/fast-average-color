window.addEventListener('load', function() {
    var
        fac = new FastAverageColor(),
        image = document.querySelector('.big-photo'),
        text = document.querySelector('.text-photo'),
        x0 = image.width / 2,
        y0 = image.height / 2,
        step = 0.1,
        n = 30,
        a = 13,
        r,
        fs = 10,
        pi = Math.PI;

    for (var angle = 0; angle < 2 * pi * n; angle += step) {
        r = a * angle / 2 / pi;
        var
            x = x0 + r * Math.cos(angle),
            y = y0 + r * Math.sin(angle),
            sym = document.createElement('div');

        sym.innerHTML = '0123456789'[Math.floor(Math.random() * 10)];
        sym.style = 'position: absolute; left: ' + x + 'px; font-size: ' + fs + 'px; top: ' + y + 'px; transform: rotate(' + angle + 'deg)';
        text.appendChild(sym);

        var color = fac.getColor(image, {left: x, top: y, width: sym.offsetWidth, height: sym.offsetHeight});
        sym.style.color = color.rgb;

        fs += 0.005;
    }

    image.classList.add('big-photo_fade');
}, false);
