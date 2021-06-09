module.exports = io => {
    const crypto = require('crypto');
    const likedMovies = {};
    try {
        io.on('connection', (socket) => {
            socket.on('joinroom', (roomId) => {
                //if likes object for room hasn't been created
                if(!io.sockets.adapter.rooms.has(roomId)){
                    likedMovies[roomId] = {}
                }
                socket.join(roomId);
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