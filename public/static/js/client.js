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

const clientLikedItem = (id, media_type) => {
    socket.emit('clientLikedItem', { id, media_type });
}

$("#copy-session").click(() => {
    const texttocopy = $('#session-url').text();
    navigator.clipboard.writeText(texttocopy)
        .then(() => {
            toastr.options = {
                closeButton: false,
                debug: false,
                newestOnTop: false,
                progressBar: false,
                positionClass: 'toast-top-right',
                preventDuplicates: true,
                onclick: null,
                showDuration: 500,
                hideDuration: 1000,
                timeOut: 3500,
                extendedTimeOut: 500,
                showEasing: 'swing',
                hideEasing: 'swing',
                showMethod: 'show',
                hideMethod: 'fadeOut'
            }
            toastr.info(
                `<div class="toast-icon">
                    <img class="copy-icon"></img>
                </div>
                <div class="toast-text">
                    <div>
                        Copied to clipboard!
                    </div>
                </div>`
            );
        });
});