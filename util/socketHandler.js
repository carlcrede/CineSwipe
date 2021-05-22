module.exports = io => {
    let likedMovies = {};
    io.on('connection', (socket) => {
        socket.on('newroom', () => {
            likedMovies[socket.id] = {};
            console.log('new room started: ', socket.id);
            socket.emit('session', socket.id);
        });

        socket.on('joinroom', (roomId) => {
            socket.join(roomId);
            socket.emit('session', roomId);
            // console.log('somsone joined room, socket id: ' + socket.id);
            // console.log(io.sockets.adapter.rooms);
        });

        socket.on('clientLikedItem', (item) => {
            if (likedMovies[getRoom(socket)][item.id]) {
                io.in(getRoom(socket)).emit('match', item);
            } else {
                likedMovies[getRoom(socket)][item.id] = true;
            }
        });
    });
}

const getRoom = socket => {
    return Array.from(socket.rooms.values()).pop();
}