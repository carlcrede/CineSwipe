const socket = io();

socket.emit('joinroom', location.pathname.substr(1));

$("#session-url").text(location.host + location.pathname);
$('#session-copy-icon').removeClass('hidden');

socket.on('match', (item) => {
    if (!$(`#match-${item.id}`).length) {
        CardManager.addCardToMatches(item);
    }
});

const clientLikedItem = async (item) => {
    socket.emit('clientLikedItem', { id: item.id, media_type: item.media_type});
    const liked = {like: {
        id: item.id,
        media_type: item.media_type,
        genres: item.genres
    }};
    const post = await fetch('/likes', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(liked)
    });
}