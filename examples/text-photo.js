window.addEventListener('load', function() {
    var
        fac = new FastAverageColor({defaultColor: [0, 0, 0, 0]}),
        image = document.querySelector('.big-photo'),
        text = document.querySelector('.text-photo'),
        width = image.width,
        height = image.height,
        x0 = width / 2,
        y0 = height / 2,
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
            y = y0 + r * Math.sin(angle);

        if (x < 0 || y < 0 || x > width || y > height) {
            continue;
        }

        var
            sym = document.createElement('div');
            style = sym.style;

        sym.innerHTML = '0123456789'[Math.floor(Math.random() * 10)];

        style.position = 'absolute';
        style.left = x + 'px';
        style.fontSize = fs + 'px';
        style.top = y + 'px';
        style.transform = 'rotate(' + angle + 'deg)';
        text.appendChild(sym);

        var color = fac.getColor(image, {
            left: x,
            top: y,
            width: sym.offsetWidth,
            height: sym.offsetHeight
        });

        style.color = color.rgb;

        fs += 0.005;
    }

    image.classList.add('big-photo_fade');
}, false);
