module.exports = io => {
    let likedMovies = {};
    try {
        io.on('connection', (socket) => {
            socket.on('newroom', () => {
                likedMovies[socket.id] = {};
                socket.emit('session', socket.id);
            });

            socket.on('joinroom', (roomId) => {
                socket.join(roomId);
                socket.emit('session', roomId);
            });

            socket.on('clientLikedItem', (item) => {
                if (likedMovies[getRoom(socket)][item.id]) {
                    io.in(getRoom(socket)).emit('match', item);
                } else {
                    likedMovies[getRoom(socket)][item.id] = true;
                }
            });
        });
    } catch (error) {
        console.error(error);
    }
}

const getRoom = socket => {
    return Array.from(socket.rooms.values()).pop();
}