import AverageColor from '../index.es6';

window.addEventListener('load', () => {
    const
        ac = new AverageColor(),
        items = document.querySelectorAll('.item');

    for (let i = 0; i < items.length; i++) {
        const
            item = items[i],
            color = ac.get(item.querySelector('img'));

        item.style.backgroundColor = color.rgb;
        item.style.color =  color.isDark ? 'white' : 'black';
    }
}, false);
