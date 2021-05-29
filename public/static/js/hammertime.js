let wrapper = $('.wrapper');

const initHammer = (elem, item) => {
    const hammertime = new Hammer(elem);

    hammertime.get('pan').set({ direction: Hammer.DIRECTION_ALL, threshold: 5 });

    hammertime.get('press').set({ time: 100 });

    hammertime.on('pan', (ev) => {
        elem.style.transition = '';
        elem.style.transform = `translate3d(${ev.deltaX}px, ${ev.deltaY}px, 0) rotateY(${ev.deltaX/1000}deg) rotateZ(${ev.deltaX/100}deg) scale(1.05)`;
    });

    hammertime.on('panstart', () => {
        $(elem).toggleClass('moving', true);
        elem.style.transform = elem.style.transform.replace('scale(1)', 'scale(1.05)');
    });

    hammertime.on('panend', async (ev) => {
        $(elem).toggleClass('moving', false);
        const moveOutWidth = document.body.clientWidth;
        const keep = Math.abs(ev.velocityX) < 1.1;
        if (!keep) {
            const endX = Math.max(Math.abs(ev.velocityX) * moveOutWidth, moveOutWidth);
            const toX = ev.deltaX > 0 ? endX : -endX;
            const endY = Math.abs(ev.velocityY) * moveOutWidth;
            const toY = ev.deltaY > 0 ? endY : -endY;
            elem.style.transition = 'all .4s ease-in-out';
            elem.style.transform = `translate3d(${toX}px, ${toY + ev.deltaY}px, 0)`;
            if (!elem.classList.contains('first')) {
                if (toX > 0) {
                    clientLikedItem(item);
                }
            }
            addCard();
            setTimeout(() => {
                elem.remove();
            }, 1000);

        } else {
            elem.style.transition = 'all .2s ease-in-out';
            elem.style.transform = `translate3d(0, 0, 0) scale(1)`;
        }
    });

    hammertime.on('press', () => {
        $(elem).toggleClass('moving');
        elem.style.transition = 'all .2s ease-in-out';
        elem.style.transform = 'perspective(1px) scale(1.05)';
    });

    hammertime.on('pressup', () => {
        $(elem).toggleClass('moving');
        elem.style.transform = elem.style.transform.replace('scale(1.05)', 'scale(1)');
    });
}

let matches = 0;
$('#matchesCount').text(matches);

const changeTab = (tabId) => {
    const tab = $(`#${tabId}`);
    if (tab.hasClass('active')) {
        return;
    }
    tabs.toggleClass('active');
    tabcontent.children().toggleClass('tabcontent');
};

const tabs = $('.tablinks');
const tabcontent = $('#tabcontent');

tabs.map((index, value) => {
    const hammertime = new Hammer(value);

    hammertime.on('tap', (ev) => {
        changeTab(value.id);
    });
});