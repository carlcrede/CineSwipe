module.exports = io => {
    let count = 0;
    io.on('connection', (socket) => {
        socket.on('newroom', () => {
            console.log('new room started: ', socket.id);
            socket.emit('session', { sessionLink: `/${socket.id}` });
        });
        socket.on('joinroom', (data) => {
            if (io.sockets.adapter.rooms.get(data)) {
                socket.join(data);
                socket.to(data).emit('joined', "new socket joined room: " + data + " with id: " + socket.id)
                console.log(io.sockets.adapter.rooms.get(data).size);
                socket.emit('session', { sessionLink: `/${data}` });
            }
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