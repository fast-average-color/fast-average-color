var App = {
    init: function() {
        this._ac = new FastAverageColor();
        this._video = document.querySelector('video');
        this._container = document.querySelector('.video-container');

        this.size = 70;

        this.countByWidth = 10;
        this.countByHeight = 5;

        this.updateShadows = this.updateShadows.bind(this);

        this.bindEvents();
    },
    createShadows: function() {
        this._topElems = [];
        this._bottomElems = [];
        this._leftElems = [];
        this._rightElems = [];

        var
            elem,
            size;

        for (var i = 0; i < this.countByWidth; i++) {
            size = this._width / this.countByWidth;
            elem = this.createShadow('top');
            elem.style.left = (i * size) + 'px';
            this._topElems.push(elem);

            elem = this.createShadow('bottom');
            elem.style.left = (i * size) + 'px';
            this._bottomElems.push(elem);
        }

        for (i = 0; i < this.countByHeight; i++) {
            elem = this.createShadow('left');
            size = this._height / this.countByHeight;
            elem.style.top = (i * size) + 'px';
            this._leftElems.push(elem);

            elem = this.createShadow('right');
            elem.style.top = (i * size) + 'px';
            this._rightElems.push(elem);
        }
    },
    createShadow: function(position) {
        var elem = document.createElement('div');
        elem.className = 'video-shadow video-shadow_' + position;
        elem.style.width = this.size + 'px';
        elem.style.height = this.size + 'px';

        this._container.appendChild(elem);

        return elem;
    },
    bindEvents: function() {
        this._video.addEventListener('play', function() {
            this._width = this._video.videoWidth;
            this._height = this._video.videoHeight;

            if (!this._shadowsCreated) {
                this.createShadows();
            }

            this._shadowsCreated = true;

            this._requestId = window.requestAnimationFrame(this.updateShadows);
        }.bind(this), false);

        this._video.addEventListener('pause', function() {
            window.cancelAnimationFrame(this._requestId);
        }.bind(this), false);
    },
    updateShadows: function() {
        var ac = this._ac,
            width = this._width,
            height = this._height,
            video = this._video,
            size,
            blur,
            offset;

        for (var i = 0; i < this._leftElems.length; i++) {
            size = Math.floor(this._height / this.countByHeight);

            var leftColor = ac.getColor(video, {
                left: 0,
                top: size * i,
                width: size,
                height: size
            });

            var rightColor = ac.getColor(video, {
                left: width - size,
                top: size * i,
                width: size,
                height: size
            });

            offset = size;
            blur = size;

            this._leftElems[i].style.boxShadow = '-' + offset + 'px 0 ' + blur + 'px ' + leftColor.rgb;
            this._rightElems[i].style.boxShadow = offset + 'px 0 ' + blur + 'px ' + rightColor.rgb;
        }

        for (i = 0; i < this._topElems.length; i++) {
            size = Math.floor(this._width / this.countByWidth);

            var topColor = ac.getColor(video, {
                left: size * i,
                top: 0,
                width: size,
                height: size
            });

            var bottomColor = ac.getColor(video, {
                left: size * i,
                top: height - size,
                width: size,
                height: size
            });

            offset = size;
            blur = size;

            this._topElems[i].style.boxShadow = '0 -' + offset + 'px ' + blur + 'px ' + topColor.rgb;
            this._bottomElems[i].style.boxShadow = '0 ' + offset + 'px ' + blur + 'px ' + bottomColor.rgb;
        }

        this._requestId = window.requestAnimationFrame(this.updateShadows);
    }
};

App.init();
