/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "Ambilight" }]*/
/*global Ambilight */
var Ambilight4Sides = {
    init: function(video, container) {
        this._ac = new FastAverageColor();
        this._video = video;
        this._container = container;

        this.radius = '200px',
        this.delta = '200px',
        this.size = 70;

        this.bindEvents();

        !video.paused && this._onplay();
    },
    destroy: function() {
        if (this._video) {
            this._video.removeEventListener('play', this._onplay, false);
            this._video.removeEventListener('pause', this._onpause, false);
            this._container.style.boxShadow = 'none';
        }

        window.cancelAnimationFrame(this._requestId);

        delete this._ac;
        delete this._video;
        delete this._container;

    },
    bindEvents: function() {
        var that = this;

        this._onplay = function() {
            that._width = that._video.videoWidth;
            that._height = that._video.videoHeight;

            Ambilight._onplay();

            that._requestId = window.requestAnimationFrame(that.updateBoxShadows.bind(that));
        };

        this._onpause = function() {
            window.cancelAnimationFrame(that._requestId);
        };

        this._video.addEventListener('play', this._onplay, false);
        this._video.addEventListener('pause', this._onpause, false);
    },
    updateBoxShadows: function() {
        var
            ac = this._ac,
            width = this._width,
            height = this._height,
            size = this.size,
            video = this._video,
            colorTop = ac.getColor(video, {
                left: 0,
                top: 0,
                height: size,
                width: width
            }),
            colorRight = ac.getColor(video, {
                left: width - size,
                top: 0,
                width: size,
                height: height
            }),
            colorLeft = ac.getColor(video, {
                left: 0,
                top: 0,
                width: size,
                height: height
            }),
            colorBottom = ac.getColor(video, {
                left: 0,
                top: height - size,
                width: width,
                height: size
            });

        this._container.style.boxShadow = [
            '0 -{delta} {radius} ' + colorTop.rgb,
            '{delta} 0 {radius} ' + colorRight.rgb,
            '0 {delta} {radius} ' + colorBottom.rgb,
            '-{delta} 0 {radius} ' + colorLeft.rgb
        ]
            .join(', ')
            .replace(/\{delta\}/g, this.delta)
            .replace(/\{radius\}/g, this.radius);

        this._requestId = window.requestAnimationFrame(this.updateBoxShadows.bind(this));
    }
};
