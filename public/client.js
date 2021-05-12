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