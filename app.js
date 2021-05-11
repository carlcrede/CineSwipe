require('dotenv').config();

const express = require('express');
const app = express();

// const helmet = require('helmet');
// app.use(helmet());

const server = require('http').createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const PORT = process.env.PORT || 8080;

io.on('connection', socket => {
    socket.on('newroom', () => {
        console.log('new room started: ' + socket.id);
    });
    socket.on('joinroom', (data) => {
        socket.join(data);
        socket.to(data).emit('joined', "new socket joined room: " + data + " with id: " + socket.id)
        console.log(io.sockets.adapter.rooms.get(data).size);
    })
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/:id', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// error page
app.get('/*', (req, res) => {
    res.status(404).send(`<h1>The page you were looking for was not found.</h1>`);
});

const httpServer = server.listen(PORT, (error) => {
    if (error) {
        throw error;
    }
    console.log('Server running on port', httpServer.address().port);    
});
