$(window).on('load', function() {
    var
        ac = new FastAverageColor(),
        items = $('.slider__item'),
        border = $('.big-image-border'),
        bigImage = $('.big-image');

    bigImage.removeClass('big-image_hidden');

    items.on('click', function() {
        var elem = $(this);

        items.removeClass('slider__item_active');
        elem.addClass('slider__item_active');

        bigImage.attr('src', elem.attr('src'));

        var width = bigImage[0].naturalWidth,
            height = bigImage[0].naturalHeight,
            size = 30;

        var top = ac.getColor(elem[0], {left: 0, top: 0, width: width, height: size}),
            bottom = ac.getColor(elem[0], {left: 0, top: height - size, width: width, height: size}),
            left = ac.getColor(elem[0], {left: 0, top: 0, width: size, height: height}),
            right = ac.getColor(elem[0], {left: width - size, top: 0, width: size, height: height});

        border.css({
            'border-top-color': top.rgb,
            'border-right-color': right.rgb,
            'border-bottom-color': bottom.rgb,
            'border-left-color': left.rgb
        });
    });

    items.eq(0).click();
});
