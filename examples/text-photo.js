var App = {
    init: function() {
        this._fac = new FastAverageColor({defaultColor: [0, 0, 0, 0]});
        this._image = document.querySelector('.big-photo');
        this._canvas = document.querySelector('.text-photo');
        this._ctx = this._canvas.getContext('2d');
        
        this.setImage('firefox');
    },
    setImage: function(name) {
        var that = this;
        
        if (this._currentName === name) { return; }

        this._currentName = name;
        this._image.classList.remove('big-photo_fade');
        this._image.classList.add('big-photo_load');
        this._canvas.classList.remove('text-photo_fade');

        this._image.onload = function() {
            var width = that._image.width,
                height = that._image.height;

            that._canvas.width = width;
            that._canvas.height = height;
            that._ctx.clearRect(0, 0, width, height);
            
            setTimeout(function() {
                that.generate({
                    firefox: 'Mozilla Firefox',
                    chrome: 'Google Chrome',
                    ie: 'Internet Explorer',
                    opera: 'Opera'
                }[name]);
                
                that._image.classList.add('big-photo_fade');
                that._image.classList.remove('big-photo_load');
                that._canvas.classList.add('text-photo_fade');
            }, 25);
        };

        this._image.src = './images/' + name + '.jpg';
    },
    generate: function(str) {
        var width = this._image.width,
            height = this._image.height,
            x0 = width / 2,
            y0 = height / 2,
            step,
            n = 40,
            a = 12,
            fs = 6,
            pi = Math.PI,
            pos = 0,
            ctx = this._ctx;
        
        for (var angle = pi; angle < 2 * pi * n; angle += step) {
            var r = a * angle / 2 / pi;
            step = Math.asin((fs - 2) / r) * 2;
            var
                x = x0 + r * Math.cos(angle),
                y = y0 + r * Math.sin(angle);

            if (x < 0 || y < 0 || x > width || y > height) {
                continue;
            }

            var color = this._fac.getColor(this._image, {
                left: x,
                top: y,
                width: Math.floor(fs),
                height: Math.floor(fs) * 0.6
            });

            ctx.save();

            ctx.font = Math.floor(fs) + 'px Arial';
            ctx.fillStyle = color.rgb;
            if (!str[pos]) {
                pos = 0;
            }

            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.fillText(str[pos], 0, 0);
            pos++;

            ctx.restore();            

            fs += 0.005;
        }
    }
};

App.init();
