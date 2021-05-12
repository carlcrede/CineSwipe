let elements = $('.wrapper').children();
let wrapper = $('.wrapper');

const initHammer = elem => {
    const hammertime = new Hammer(elem);

    hammertime.get('press').set({ time: 100 });

    hammertime.get('swipe').set({ velocity: 0.9 });

    hammertime.on('pan', (ev) => {
        elem.style.transition = '';
        elem.style.transform = `translate3d(${ev.deltaX}px,0,0) rotateY(${ev.deltaX/1000}deg) rotateZ(${ev.deltaX/100}deg) scale(1.05)`;
    });

    hammertime.on('panstart', () => {
        elem.style.transition = '.2s ease-in-out';
        elem.style.transform = elem.style.transform.replace('scale(1)', 'scale(1.05)');
    });

    hammertime.on('panend', (ev) => {
        elem.style.transition = '.2s ease-in-out';
        elem.style.transform = `translate3d(0, 0, 0) scale(1)`;
    });

    hammertime.on('press', () => {
        console.log('pressed');
        elem.style.transition = '.2s ease-in-out';
        //elem.style.transform = elem.style.transform.replace('scale(1)', 'scale(1.05)');
        elem.style.transform = 'scale(1.05)';
    });

    hammertime.on('pressup', () => {
        elem.style.transform = elem.style.transform.replace('scale(1.05)', 'scale(1)');
    });

    hammertime.on('swiperight', () => {
        elem.remove();

    });

    hammertime.on('swipeleft', () => {
        elem.remove();
        const newElem = $('<div></div>').addClass('child');
        wrapper.prepend(newElem[0]);
        initHammer(newElem[0]);
    });
}

$.map(elements, (elem, index) => {
    initHammer(elem);
});
