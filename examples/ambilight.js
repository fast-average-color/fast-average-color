/*eslint no-unused-vars: ["error", { "vars": "local" }]*/
var Ambilight = {
    init: function() {
        var
            that = this,
            inputs = document.querySelectorAll('input[type="radio"]');

        inputs[location.hash === '#4Sides' ? 1 : 0].checked = true;

        var currentType = document.querySelector('input:checked').value;

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
        var
            video = document.querySelector('video'),
            container = document.querySelector('.video-container');

        window['Ambilight' + type].init(video, container);

        location.hash = type;
    },
    _onplay: function() {
        document.querySelector('.hint').style.display = 'none';
    }
};

window.addEventListener('load', function() {
    Ambilight.init();
}, false);
