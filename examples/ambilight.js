var App = {
    init: function() {
        var
            that = this,
            inputs = document.querySelectorAll('input[type="radio"]'),
            currentType = 'ManyPoints';

        inputs[0].onchange = inputs[1].onchange = function() {
            that.destroyAmbilight(currentType);
            that.initAmbilight(this.value);
            currentType = this.value;
        };

        this.initAmbilight(currentType);
    },
    destroyAmbilight: function(type) {
        window['Ambilight' + type].destroy();
    },
    initAmbilight: function(type) {
        var video = document.querySelector('video');
        var container = document.querySelector('.video-container');
        window['Ambilight' + type].init(video, container);
    }
};

App.init();
