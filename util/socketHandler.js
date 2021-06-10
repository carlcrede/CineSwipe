module.exports = io => {
    const crypto = require('crypto');
    const likedMovies = {};
    try {
        io.on('connection', (socket) => {
            socket.on('joinroom', (roomId) => {
                if(!roomId){
                    const new_room = crypto.randomBytes(6).toString('hex');
                    likedMovies[new_room] = {}
                    socket.join(new_room);
                    socket.emit('session', new_room);
                } else {
                    socket.join(roomId);
                    socket.emit('session', roomId);
                }     
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