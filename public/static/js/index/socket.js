const socket = io();

socket.emit('joinroom', location.pathname.substr(1));

socket.on('session', (roomId) => {
    $('#session-copy-icon').removeClass('hidden');
    $("#session-url").text(location.host + '/' + roomId);
});

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