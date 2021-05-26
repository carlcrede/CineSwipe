// load environment vars
require('dotenv').config();

// create express app
const express = require('express');
const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}));

// tring gzip compression for performance
const compression = require('compression');
app.use(compression());

const db = require('./db/db-connection');

// use custom rate-limit
const rateLimit = require('./util/rate-limit');
app.use('/auth/*', rateLimit.auth);

// include helmet for some security
const helmet = require('helmet');
app.use(helmet({ 
    contentSecurityPolicy: { 
        useDefaults: true, 
        directives: { 
            'script-src': ["'self'", 'code.jquery.com', 'cdnjs.cloudflare.com'], 
            'style-src': ["'self'", 'cdnjs.cloudflare.com', 'unsafe-inline', 'code.jquery.com'],
            'img-src': ["'self'", 'data:', 'www.themoviedb.org', 'image.tmdb.org'],
        },
    },
}));

// serve static files from /public folder
// trying cahce-control for performance
/* app.use(express.static(__dirname + '/public/static', { maxAge: 31557600 })); */
app.use(express.static(__dirname + '/public/static'));

// create http server
const http = require('http').createServer(app);
const { Server } = require('socket.io');
const PORT = process.env.PORT || 8080;

// mount socket.io to server
const io = new Server(http);
require('./util/socketHandler')(io);

// use express-session with specified settings
const session = require('express-session');
app.use(session({
    name: 'sid',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        sameSite: 'strict',
        secure: false
    }
}));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

// fs module for server-side rendering
const pages = require('./util/ssr');

// routing
const moviedbRoute = require('./routes/moviedb');
const { Double } = require('bson');
app.use(moviedbRoute.router);
const authRoute = require('./routes/auth/auth');
app.use(authRoute.router);
const sessionRoute = require('./routes/session');
app.use(sessionRoute.router);

app.get('/', (req, res) => {
    res.send(pages.index);
});

app.get('/:id', (req, res, next) => {
    if(io.sockets.adapter.rooms.has(req.params.id)){
        res.send(pages.index);
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