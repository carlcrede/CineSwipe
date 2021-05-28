const socket = io();

// keeps track of what has been liked in the room
let likedMovies = {};

if(location.pathname === '/'){
    socket.emit('newroom');
} else {
    socket.emit('joinroom', location.pathname.substr(1));
}

socket.on('session', (roomId) => {
    const session = $("#session-url");
    session.text(location.host + '/' + roomId + '');
});

socket.on('match', (item) => {
    if (!$(`#match-${item.id}`).length) {
        addCardToMatches(item);
        $('#matchesCount').text(++matches);
        //$('#match').prepend(`<h1 id="match-${movieId}">Match: ${movieId}</h1>`);
    }
});

const clientLikedItem = async (item) => {
    socket.emit('clientLikedItem', { id: item.id, media_type: item.media_type });
    const liked = {like: {
        id: item.id,
        media_type: item.media_type
    }};
    const response = await fetch('/user/like', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(liked)
    });
    const result = await response.json();
    console.log({'post /user/like result': result});
}

$("#copy-session").click(() => {
    const texttocopy = $('#session-url').text();
    navigator.clipboard.writeText(texttocopy)
        .then(() => {
            displayCopyToast();
        });
});