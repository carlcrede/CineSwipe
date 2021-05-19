// load environment vars
require('dotenv').config();

// create express app
const express = require('express');
const app = express();
app.use(express.json())

const db = require('./db/db');

// include helmet for some security
const helmet = require('helmet');
app.use(helmet({ 
    contentSecurityPolicy: { 
        useDefaults: true, 
        directives: { 
            'script-src': ["'self'", 'code.jquery.com', 'cdnjs.cloudflare.com'], 
            'style-src': ["'self'", 'cdnjs.cloudflare.com', 'unsafe-inline'],
            'img-src': ['self', 'www.themoviedb.org', 'image.tmdb.org'],
        },
    },
}));

// serve static files from /public folder
app.use(express.static(__dirname + '/public'));

// create http server
const http = require('http').createServer(app);
const { Server } = require('socket.io');
const PORT = process.env.PORT || 8080;

// mount socket.io to server
const io = new Server(http);
require('./socketHandler')(io);

// fs module for server-side rendering
const fs = require('fs');
const index = fs.readFileSync(__dirname + '/public/index.html', 'utf-8');

// routing
const moviedbRoute = require('./routes/moviedb');
const { Double } = require('bson');
app.use(moviedbRoute.router);
const authRoute = require('./routes/auth');
app.use(authRoute.router);


app.get('/', (req, res) => {
    res.send(index);
});

app.get('/:id', (req, res, next) => {
    if(io.sockets.adapter.rooms.has(req.params.id)){
        res.send(index);
    } else {
        next();
    }
});

// error page
app.get('/*', (req, res) => {
    res.status(404).send(`<h1>The page you were looking for was not found.</h1>`);
});

const server = http.listen(PORT, (error) => {
    if (error) {
        throw error;
    }
    console.log('Server running on port', server.address().port);    
});