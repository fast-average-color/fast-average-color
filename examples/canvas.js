(function() {
    return {
        init: function() {
            this._fac = new FastAverageColor();

            this._canvas = document.querySelector('canvas');
            this._ctx = this._canvas.getContext('2d');

            this._info = document.querySelector('.info');
            this._infoColor = document.querySelector('.info__color');

            this._stoped = false;
            this._isPrecision = true;

            this.nextStep = this.nextStep.bind(this);

            this.bindEvents();

            this.start();
        },
        bindEvents: function() {
            var self = this;

            document.querySelector('#start').onclick = function() {
                self._stoped = !self._stoped;
                if (self._stoped) {
                    this.innerHTML = 'Start';
                    self.stop();
                } else {
                    this.innerHTML = 'Stop';
                    self.start();
                }
            };
            
            document.querySelector('#precision').onclick = function() {
                self._isPrecision = true;
                self.getColor();
            };
            
            document.querySelector('#speed').onclick = function() {
                self._isPrecision = false;
                self.getColor();
            };    
        },    
        start: function() {
            this._timer = setInterval(this.nextStep, 50);
        },
        stop: function() {
            clearInterval(this._timer);
        },
        nextStep: function() {
            var width = this._canvas.width,
                height = this._canvas.height;

            this._ctx.fillStyle = 'rgba(' + [
                this.rndFloor(255),
                this.rndFloor(255),
                this.rndFloor(255),
                this.rnd(1)
            ].join(',') + ')';

            this._ctx.fillRect(this.rnd(width), this.rnd(height), this.rnd(width), this.rnd(height));

            this.getColor();
        },
        getColor: function() {
            var timeA = Date.now(),
                color = this._fac.getColor(this._canvas, {mode: this._isPrecision ? 'precision' : 'speed'});

            this._info.style.backgroundColor = color.rgba;
            this._infoColor.innerHTML = [
                'rgb: ' + color.rgb,
                'rgba: ' + color.rgba,
                'hex: ' + color.hex,
                'hexa: ' + color.hexa,
                'time: ' + (Date.now() - timeA) + ' ms'
            ].map(function(item) {
                return '<div class="info__item">' + item + '</div>';
            }).join('');
        },
        rnd: function(max) {
            return Math.random() * max;
        },
        rndFloor: function(max) {
            return Math.floor(Math.random() * max);
        }
    };
})().init();
