const elem = document.getElementById('card');
const hammertime = new Hammer(elem);
hammertime.get('press').set({ time: 100 });
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
    elem.style.transition = '.2s ease-in-out';
    elem.style.transform = elem.style.transform.replace('scale(1)', 'scale(1.05)');
});

hammertime.on('pressup', () => {
    elem.style.transform = elem.style.transform.replace('scale(1.05)', 'scale(1)');
});