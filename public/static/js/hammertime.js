const initHammer = (elem, item) => {
    const hammertime = new Hammer(elem);

    hammertime.get('pan').set({ direction: Hammer.DIRECTION_ALL, threshold: 5 });

    hammertime.on('pan', (ev) => {
        $('.card-trailer').toggleClass('no-click', true);
        elem.style.transform = `translate3d(${ev.deltaX}px, ${ev.deltaY}px, 100px) rotateY(${ev.deltaX/1000}deg) rotateZ(${ev.deltaX/100}deg) scale(1.05)`;
    });

    hammertime.on('panstart', () => {
        $('.card-trailer').toggleClass('no-click', true);
        $(elem).toggleClass('moving', true);
    });

    hammertime.on('panend', async (ev) => {
        $('.card-trailer').toggleClass('no-click', false);
        $(elem).toggleClass('moving', false);
        const moveOutWidth = document.body.clientWidth;
        const keep = Math.abs(ev.velocityX) < 1.1;
        if (!keep) {
            hammertime.set({enable: false});
            const endX = Math.max(Math.abs(ev.velocityX) * moveOutWidth, moveOutWidth);
            const toX = ev.deltaX > 0 ? endX : -endX;
            const endY = Math.abs(ev.velocityY) * moveOutWidth;
            const toY = ev.deltaY > 0 ? endY : -endY;
            elem.style.transition = 'all 1s ease';
            elem.style.transform = `translate3d(${toX}px, ${toY + ev.deltaY}px, 100px)`;
            if (!elem.classList.contains('first')) {
                if (toX > 0) {
                    Socket.clientLikedItem(item);
                }
            }
            CardManager.addCard();
            setTimeout(() => {
                elem.remove();
            }, 1000);
        } else {
            $('.card-trailer').toggleClass('no-click', false);
            elem.style.removeProperty('transform');
        }
    });
};

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