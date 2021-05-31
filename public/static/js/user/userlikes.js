const fetchUserLikes = async() => {
    const response = await fetch('/likes');
    const result = await response.json();
    return result;
}

( async () => {
    document.title = 'Your likes';
    const userLikes = await fetchUserLikes();
    const likesElem = $('#match');
    userLikes.forEach( async like => {
        const details = await fetchDetails(like);
        let card = buildItemCard(details, false);
        card.css('position', 'relative');
        card.attr('id', `match-${like.likeId}`);
        likesElem.append(card);
        card.children().not('.child-card-title').hide();
        card.addClass('collapsed');
        addCollapseListener(card);
    });
    insertMediaPercentages(userLikes);
})();

const insertMediaPercentages = (likes) => {
    const media_type_likes = {movies: 0, tv: 0}
    likes.forEach((like) => {
        if(like.media_type === 'movie'){
            media_type_likes.movies++;
        } else {
            media_type_likes.tv++;
        }
    });
    const sum = media_type_likes.movies + media_type_likes.tv;
    const movieLikesPercent = percent(sum, media_type_likes.movies);
    const tvLikesPercent = percent(sum, media_type_likes.tv);
    $('#liked-movies-count').text(`Movies: ${movieLikesPercent}%`);
    $('#liked-tv-count').text(`TV: ${tvLikesPercent}%`);
}

const percent = (sum, value) => {
    console.log(sum / value);
    const percentFloat =(!value == 0) ? (value / sum) * 100 : 0
    return percentFloat.toFixed(0);
}

const addCollapseListener = (card) => {
    card.click(() => {
        card.off();
        card.removeClass('collapsed');
        card.children().not('.child-card-title').show()
        addExpandedListener(card);
    });
};

const addExpandedListener = (card) => {
    card.click(() => {
        card.off();
        card.children().not('.child-card-title').hide();
        card.addClass('collapsed');
        addCollapseListener(card);
    });
}