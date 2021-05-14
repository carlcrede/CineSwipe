const socket = io();

// keeps track of what has been liked in the room
let likedMovies = {};

if(location.pathname === '/'){
    socket.emit('newroom');
} else {
    socket.emit('joinroom', location.pathname.substr(1));
}

socket.on('session', (roomId) => {
    const session = $("#copy-session");
    session.text(location.host + '/' + roomId + ' ');
    session.append('<i class="far fa-clone"></i>');
});

socket.on('match', (movieId) => {
    if (!$(`#match-${movieId}`).length) {
        $('#match').prepend(`<h1 id="match-${movieId}">Match: ${movieId}</h1>`);
    }
});

const clientLikedMovie = (movieId) => {
    socket.emit('clientLikedMovie', movieId);
}

$("#copy-session").click(() => {
    const texttocopy = $('#copy-session').text();
    navigator.clipboard.writeText(texttocopy).then(function() {
        console.log('Async: Copying to clipboard was successful!');
      }, function(err) {
        console.error('Async: Could not copy text: ', err);
    });
});