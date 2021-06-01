module.exports = io => {
    const crypto = require('crypto');
    const likedMovies = {};
    try {
        io.on('connection', (socket) => {
            socket.on('newroom', () => {
                const roomId = crypto.randomBytes(6).toString('hex');
                likedMovies[roomId] = {};
                socket.join(roomId);
                socket.emit('session', roomId);
            });

            socket.on('joinroom', (roomId) => {
                socket.join(roomId);
                socket.emit('session', roomId);
            });

            socket.on('clientLikedItem', (item) => {
                if (likedMovies[getRoom(socket)]) {
                    if (likedMovies[getRoom(socket)][item.id]) {
                        io.in(getRoom(socket)).emit('match', item);
                    } else {
                        likedMovies[getRoom(socket)][item.id] = true;
                    }
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