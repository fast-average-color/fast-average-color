window.addEventListener('load', function() {
    var
        ac = new FastAverageColor(),
        items = document.querySelectorAll('.item');

    for (var i = 0; i < items.length; i++) {
        var
            item = items[i],
            image = item.querySelector('.item__image'),
            imageContainer = item.querySelector('.item__image-container'),
            size = 20,
            width = image.naturalWidth,
            height = image.naturalHeight,
            colorTop = ac.getColor(image, {height: size}),
            colorRight = ac.getColor(image, {left: width - size, width: size}),
            colorLeft = ac.getColor(image, {width: size}),
            colorBottom = ac.getColor(image, {top: height - size, height: size});

        imageContainer.style.borderColor = [
            colorTop.rgb,
            colorRight.rgb,
            colorBottom.rgb,
            colorLeft.rgb
        ].join(' ');
    }
}, false);
