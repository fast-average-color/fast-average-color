var App = {
    init: function() {
        this._ac = new FastAverageColor();
        this._video = document.querySelector('video');
        this._container = document.querySelector('.video-container');

        this.radius = '200px',
        this.delta = '200px',
        this.size = 70;

        this.updateBoxShadows = this.updateBoxShadows.bind(this);

        this.bindEvents();
    },
    bindEvents: function() {
        this._video.addEventListener('play', function() {
            this._width = this._video.videoWidth;
            this._height = this._video.videoHeight;

            this._requestId = window.requestAnimationFrame(this.updateBoxShadows);
        }.bind(this), false);

        this._video.addEventListener('pause', function() {
            window.cancelAnimationFrame(this._requestId);
        }.bind(this), false);
    },
    updateBoxShadows: function() {
        var ac = this._ac,
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

        this._requestId = window.requestAnimationFrame(this.updateBoxShadows);
    }
};

App.init();
