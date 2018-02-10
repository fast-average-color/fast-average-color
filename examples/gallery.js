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
        
        var width = bigImage[0].width,
            height = bigImage[0].height,
            delta = 30;
            
        var top = ac.getSync(elem[0], {x: 0, y: 0, width: width, height: delta}),
            bottom = ac.getSync(elem[0], {x: 0, y: height - delta, width: width, height: delta}),
            left = ac.getSync(elem[0], {x: 0, y: 0, width: delta, height: height}),
            right = ac.getSync(elem[0], {x: width - delta, y: 0, width: delta, height: height});
            
        border.css(
            'borderColor',
            [top.rgb, right.rgb, bottom.rgb, left.rgb].join(' ')
        );
    });
    
    items.eq(0).click();
});
