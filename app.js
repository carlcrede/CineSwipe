require('dotenv').config();
const helmet = require('helmet');
app.use(helmet());

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const PORT = process.env.PORT || 8080;

app.get('/', (req, res, next) => {
    io.on('connection', (socket) => {
        io.to(socket.id).emit()
    });
});

app.get('/:id', (req, res) => {
    io.on('connection', socket => {
        socket.join(req.params.id);
    });
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
