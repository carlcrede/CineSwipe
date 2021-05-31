const fetchUserLikes = async() => {
    const response = await fetch('/api/user/like');
    const result = await response.json();
    return result;
}

( async () => {
    document.title = 'Your likes';

    const userLikes = await fetchUserLikes();
    const likesElem = $('#match');
    userLikes.forEach( async like => {
        const detail = await fetchDetails(like);
        let card = buildItemCard(detail, false);
        card.css('position', 'relative');
        card.attr('id', `match-${like.likeId}`);
        likesElem.append(card);
    });
})();
