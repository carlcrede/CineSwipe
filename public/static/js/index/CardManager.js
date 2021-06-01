const CardManager = (() => {

    let page = 1;
    let popularMoviesAndTv;
    let cards = $('#cards');
    const invalidItemStatuses = ['Rumored', 'Planned', 'In Production', 'Post Production', 'Canceled'];

    const updateCardsWithFilters = async () => {
        clearInterval(cardInterval);
        page = 1;
        $('.wrapper').children('.child').not('.first').remove();
        const newItems = await ItemFetch.combinedMoviesAndTv(1);
        popularMoviesAndTv = [...newItems];
        const cards = $('.wrapper').children();
        if(cards.length < 10 && popularMoviesAndTv){
            for(let i = 0; i < 10 - cards.length; i++){
                addCard();
            }
        }
        cardInterval = setInterval(checkAndRepopulate, 3000);
    }

    const addCardToMatches = async (item) => {
        const details = await ItemFetch.details(item);
        let card = CardBuilder.buildItemCard(details, false);
        card.css('position', 'relative');
        card.attr('id', `match-${item.id}`);
        $('#match').prepend(card);
        $('.tab').append()
        // $('#match-notification').show()
        const match_notif = $('#match-notification');
        match_notif.show();
        setTimeout(() => {
            match_notif.fadeOut(300);
        }, 3000);
    }

    const addCard = () => {
        if (popularMoviesAndTv[0]) { 
            //if item(movie/tv show) is valid then insert card to DOM and init hammer.js eventhandlers
            if(isValidItem(popularMoviesAndTv[0])){
                let item = popularMoviesAndTv[0];
                let card = CardBuilder.buildItemCard(item);
                initHammer(...card, item);
                cards.prepend(card);
                popularMoviesAndTv.shift();
            }
        }
    }

    const isValidItem = (item) => {
        if (item.status in invalidItemStatuses) { 
            return false;
        } else if (item.media_type == 'movie' && !item.title) {
            return false;
        } else if (item.media_type == 'tv' && !item.name) {
            return false;
        } 
        return true;
    }

    const checkAndRepopulate = async() => {
        if(document.hasFocus){
            if(popularMoviesAndTv && popularMoviesAndTv.length < 1){
                page++;
                const newItems = await ItemFetch.combinedMoviesAndTv(page);
                popularMoviesAndTv = [...newItems];
            }
            const cards = $('.wrapper').children();
            if(cards.length < 10 && popularMoviesAndTv){
                for(let i = 0; i < 10 - cards.length; i++){
                    addCard();
                }
            }
        }
    };

    let cardInterval = setInterval(checkAndRepopulate, 3000);

    (function insertFirstCard() {
        const firstCard = $('<div class="child first"></div>');

        const instructions = $(
            `<div class="instructions">
            <p>Swipe right or 👍 if you'd like to watch it.</p>
            <p>Swipe left or 👎 if you don't want to watch.</p>
            <p>Don't forget to invite your friends or family!</p>
            </div>`);
        
        let btnDiv = $(`<div class="child-card-buttons"></div>`);
        const likebtn = $(`<div class="begin" id="beginBtn">Begin swiping 👍</div>`);
        btnDiv.append(likebtn);
        const btnHammer = new Hammer(...likebtn);

        initHammer(...firstCard);
        btnHammer.on('tap pressup', async (ev) => {
            firstCard.css('transition', 'all .4s ease-in-out');
            firstCard.css('transform', 'translate3d(2000px, 0, 0)');
            addCard();
            setTimeout(() => {
                firstCard.remove();
            }, 1000);
        });
        firstCard.append(instructions);
        firstCard.append(btnDiv);
        wrapper.append(firstCard);
    })();

    (async function initCards(){
        const result = await ItemFetch.initialItems();
        const initialItems = [...result];
        initialItems.sort((a, b) => b.popularity - a.popularity);
        popularMoviesAndTv = initialItems;
        for (let i = 0; i < 10; i++) {
            addCard();
        }
    })();

    return {
        addCard, addCardToMatches, updateCardsWithFilters
    }

})();