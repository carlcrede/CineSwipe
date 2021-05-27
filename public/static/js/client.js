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
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'same-origin', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {'Content-Type': 'application/json'},
        redirect: 'manual', // manual, *follow, error
        referrerPolicy: 'origin', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(liked) // body data type must match "Content-Type" header
    });
    const result = await response.json();
    console.log(result);
}

$("#copy-session").click(() => {
    const texttocopy = $('#session-url').text();
    navigator.clipboard.writeText(texttocopy)
        .then(() => {
            displayCopyToast();
        });
});