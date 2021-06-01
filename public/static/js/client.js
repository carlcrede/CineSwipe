let idleTime = 0;

const socket = io();

// keeps track of what has been liked in the room
let likedMovies = {};

$(document).ready(() => {
    document.title = "CineSwipe"
});

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
    const response = await fetch('/likes', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(liked)
    });
    const result = await response.json();
    // console.log({'post /user/like result': result});
}

//self invoking function
(function handleSessionCopyEvent() {
    //enables clicklistener
    $("#copy-session").click(() => {
        //remove event listener
        $("#copy-session").off();
        const texttocopy = $('#session-url').text();
        navigator.clipboard.writeText(texttocopy)
            .then(() => {
                displayCopyToast();
            });
        //delayed recursiion
        setTimeout(() => handleSessionCopyEvent(), 2000);
    });
})();