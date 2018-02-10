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
            delta = 50;
            
        var top = ac.getSync(elem[0], {left: 0, top: 0, width: width, height: delta}),
            bottom = ac.getSync(elem[0], {left: 0, top: height - delta, width: width, height: delta}),
            left = ac.getSync(elem[0], {left: 0, top: 0, width: delta, height: height}),
            right = ac.getSync(elem[0], {left: width - delta, top: 0, width: delta, height: height});
            
        console.log(top.rgb, bottom.rgb, left.rgb, right.rgb);

        border.css({
            'border-top-color': top.rgb,
            'border-right-color': right.rgb,
            'border-bottom-color': bottom.rgb,
            'border-left-color': left.rgb
        });
    });
    
    items.eq(0).click();
});
