const socket = io();

if(location.pathname === '/'){
    socket.emit('newroom');
} else {
    socket.emit('joinroom', location.pathname.substr(1));
}

socket.on('session', (data) => {
    const session = $("#copy-session");
    session.text(location.host + '/' + data + ' ');
    session.append('<i class="far fa-clone"></i>');
});

$("#copy-session").click(() => {
    const texttocopy = $('#copy-session').text();
    navigator.clipboard.writeText(texttocopy).then(function() {
        console.log('Async: Copying to clipboard was successful!');
      }, function(err) {
        console.error('Async: Could not copy text: ', err);
    });
})