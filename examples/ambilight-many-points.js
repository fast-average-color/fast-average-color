/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "Ambilight" }]*/
/*global Ambilight */
var AmbilightManyPoints = {
    init: function(video, container) {
        this._ac = new FastAverageColor();
        this._video = video;
        this._container = container;

        this.size = 70;

        this.countByWidth = 10;
        this.countByHeight = 5;

        this.bindEvents();

        !video.paused && this._onplay();

        var
            ua = navigator.userAgent.toLowerCase(),
            isFirefox = ua.indexOf('firefox') > -1,
            isSafari = (ua.search('safari') > -1 && ua.search('chrome') === -1);

        this._hasDoubleBlur = isFirefox || isSafari ? false : true;
    },
    destroy: function() {
        if (this._shadowsCreated) {
            for (var i = 0; i < this._topElems.length; i++) {
                this._container.removeChild(this._topElems[i]);
                this._container.removeChild(this._bottomElems[i]);
            }

            for (i = 0; i < this._leftElems.length; i++) {
                this._container.removeChild(this._leftElems[i]);
                this._container.removeChild(this._rightElems[i]);
            }
        }

        window.cancelAnimationFrame(this._requestId);

        if (this._video) {
            this._video.removeEventListener('play', this._onplay, false);
            this._video.removeEventListener('pause', this._onpause, false);
        }

        delete this._ac;
        delete this._video;
        delete this._container;
        delete this._shadowsCreated;
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
        var that = this;

        this._onplay = function() {
            that._width = that._video.videoWidth;
            that._height = that._video.videoHeight;

            Ambilight._onplay();

            if (!that._shadowsCreated) {
                that._shadowsCreated = true;
                that.createShadows();
            }

            that._requestId = window.requestAnimationFrame(that.updateShadows.bind(that));
        };

        this._onpause = function() {
            window.cancelAnimationFrame(that._requestId);
        };

        this._video.addEventListener('play', this._onplay, false);
        this._video.addEventListener('pause', this._onpause, false);
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
            blur = this._hasDoubleBlur ? size * 2 : size;

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
            blur = this._hasDoubleBlur ? size * 2 : size;

            this._topElems[i].style.boxShadow = '0 -' + offset + 'px ' + blur + 'px ' + topColor.rgb;
            this._bottomElems[i].style.boxShadow = '0 ' + offset + 'px ' + blur + 'px ' + bottomColor.rgb;
        }

        this._requestId = window.requestAnimationFrame(this.updateShadows.bind(this));
    }
};
