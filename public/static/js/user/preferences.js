( async () => {
    document.title = 'Your likes';
    const response = await fetch('/likes');
    const userLikes = await response.json();
    const likesElem = $('#matches');
    const { countryCode } = await ItemFetch.fetchIpData();
    Filtering.setFilters({watch_region: countryCode});
    userLikes.forEach( async like => {
        const details = await ItemFetch.fetchItemDetails(like);
        let card = CardBuilder.buildItemCard(details, false);
        card.css('position', 'relative');
        card.attr('id', `match-${like.likeId}`);
        likesElem.append(card);
        card.children().not('.card-title').hide();
        card.addClass('collapsed');
        addCollapseListener(card);
    });
    insertMediaPercentages(userLikes);
    insertGenreLikeCount(userLikes);
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
};

const percent = (sum, value) => {
    const percentFloat = (!value == 0) ? (value / sum) * 100 : 0
    return percentFloat.toFixed(0);
};

const insertGenreLikeCount = (likes) => {
    const genre_count = {}
    likes.forEach((like) => {
        const genres = like.genres;
        genres.forEach((genre) => {
            const genre_name = genre.name;
            if (genre_count[genre_name]){
                genre_count[genre_name]++;
            } else {
                genre_count[genre_name] = 1;
            }
        });
    });
    const genres_container = $('#liked-genres-container');
    Object.entries(genre_count).forEach((key) => {
        genres_container.append(
            `<div class="genre-preference">
                <h4 class="genre-name">
                    ${key[0]}
                </h4>
                <h4 class="genre-count">
                    ${key[1]} likes
                </h4>
            </div>`
        );
    });
};

const addCollapseListener = (card) => {
    card.click(() => {
        card.off();
        card.removeClass('collapsed');
        card.children().show();
        addExpandedListener(card);
    });
};

const addExpandedListener = (card) => {
    card.click(() => {
        card.off();
        card.children().not('.card-title').hide();
        card.addClass('collapsed');
        addCollapseListener(card);
    });
};