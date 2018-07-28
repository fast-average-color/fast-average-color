var App = {
    init: function() {
        var
            that = this,
            input = document.querySelector('.select-file'),
            captureButton = document.querySelector('.capture-photo');

        this._fac = new FastAverageColor({mode: 'precision'});

        input.onchange = function() {
            var
                file = this.files[0],
                reader  = new FileReader();

            reader.onloadend = function() {
                var img = new Image();
                img.src = reader.result;

                that._fac.getColorAsync(img, function(color) {
                    that.addImage(img, file.name, color);
                });
            };

            if (file) {
                reader.readAsDataURL(file);
            }
        };

        captureButton.onclick = function() {
            that.capture();
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
    },
    capture: function() {
        var that = this;

        navigator.getUserMedia = navigator.getUserMedia ||
                                 navigator.webkitGetUserMedia ||
                                 navigator.mozGetUserMedia;

        navigator.getUserMedia({ video: true }, function(mediaStream) {
            // Firefox
            if (!('readyState' in mediaStream)) {
                mediaStream.readyState = 'live';
            }

            var
                video = document.createElement('video'),
                previewStream = new MediaStream(mediaStream);

            if (HTMLMediaElement) {
                video.srcObject = previewStream;  // Safari 11 doesn't allow use of createObjectURL for MediaStream
            } else {
                video.src = URL.createObjectURL(previewStream);
            }

            video.muted = true;
            // Required by Safari on iOS 11. See https://webkit.org/blog/6784
            video.setAttribute('playsinline', '');
            video.play();
            video.addEventListener('playing', function() {
                setTimeout(function() {
                    var canvas = document.createElement('canvas');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;

                    var ctx = canvas.getContext('2d');
                    ctx.drawImage(video, 0, 0);

                    var image = new Image();
                    image.src = canvas.toDataURL('image/png');

                    that._fac.getColorAsync(image, function(color) {
                        that.addImage(image, 'photo', color);
                        mediaStream.stop();
                    });
                }, 500);
            });
        }, function() {
            // console.log('failure to get media');
        });
    }
};

App.init();
