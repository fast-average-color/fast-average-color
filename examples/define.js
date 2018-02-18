var App = {
    init: function() {
        var
            that = this,
            fac = new FastAverageColor({mode: 'precision'}),
            input = document.querySelector('.select-file');

        input.onchange = function() {
            var
                file = this.files[0],
                reader  = new FileReader();

            reader.onloadend = function() {
                var img = new Image();
                img.src = reader.result;

                fac.getColorFromUnloadedImage(img, function(color) {
                    that.addImage(img, file.name, color);
                });
            };

            if (file) {
                reader.readAsDataURL(file);
            }
        };
    },
    addImage: function(resource, name, color) {
        var images = document.querySelector('.images');
        var item = document.createElement('div');
        item.className = 'images__item';
        item.style.background = color.rgb;
        images.insertBefore(item, images.firstChild);

        var title = document.createElement('div');
        title.className = 'images__title';
        title.innerHTML = [
            'Filename: ' + name,
            [
                'rgb: ' + color.rgb,
                'rgba: ' + color.rgba,
                'hex: ' + color.hex,
                'hexa: ' + color.hexa
            ].join(', ')
        ].join('<br/>');
        title.style.color = color.isDark ? 'white' : 'black';
        item.appendChild(title);

        resource.className = 'images__img';
        item.appendChild(resource);
    }
};

App.init();
