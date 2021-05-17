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

$('#cardTab').click((event) => {
    openTab(event, 'cards');
});

$('#matchTab').click((event) => {
    openTab(event, 'match');
});


function openTab(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;
  
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
  }