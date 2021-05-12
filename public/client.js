const socket = io();
const room_id = window.location.pathname;
if(room_id === '/'){
    socket.emit('newroom');
} else {
    socket.emit('joinroom', room_id.substr(1));
}
socket.on('joined', (msg) => {
    console.log('Joined:', msg);
});

socket.on('session', (data) => {
    $("#sessionLink").attr('href', data.sessionLink).text(data.sessionLink);
});

$("#messageBtn").click(() => {
    const msg = $('#message').val();
    console.log(msg);
    socket.emit('liked', msg);
});

socket.on('match', (data) => {
    console.log('Match!', data);
})