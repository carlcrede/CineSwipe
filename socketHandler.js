module.exports = io => {
    let count = 0;
    io.on('connection', (socket) => {
        socket.on('newroom', () => {
            console.log('new room started: ', socket.id);
            socket.emit('session', socket.id);
        });
        socket.on('joinroom', (data) => {
            socket.join(data);
            socket.emit('session', data);
            // console.log('somsone joined room, socket id: ' + socket.id);
            // console.log(io.sockets.adapter.rooms);
        });
        socket.on('liked', (data) => {
            let room = Array.from(socket.rooms.values()).pop();
            console.log(room);
            count++;
            if (count === 2) {
                io.in(room).emit('match', data);
                count = 0;
            }
        });
    });
}