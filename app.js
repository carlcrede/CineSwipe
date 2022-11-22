require('dotenv').config();

const logger = require('./util/logger');
const express = require('express');
const app = express();
app.use(logger);
app.use(express.json())
app.use(express.urlencoded({extended: true}));

const cors = require('cors');
app.use(cors({ origin: ['http://cineswipe.herokuapp.com', 'http://localhost:3000', 'http://127.0.0.1:5173', 'http://localhost:5173']}));

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
            'style-src': ["'self'", 'cdnjs.cloudflare.com', "'unsafe-inline'", 'code.jquery.com', 'fonts.googleapis.com'],
            'img-src': ["'self'", 'data:', 'www.themoviedb.org', 'image.tmdb.org'],
            'connect-src': ["'self'" ,'api.db-ip.com/v2/free/self']
        },
    },
}));

// serve static files from /public folder
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(__dirname + '/public/static', { maxAge: 1000 * 60 * 60 * 2 }));
} else {
    app.use(express.static(__dirname + '/public/static'));
}

const http = require('http').createServer(app);
const { Server } = require('socket.io');
const PORT = process.env.PORT || 8080;

const io = new Server(http);
require('./util/socketHandler')(io);

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

// server-side rendering HTML
const pages = require('./util/ssr');

// routing
const moviedbRoute = require('./routes/moviedb');
const authRoute = require('./routes/auth/auth');
const sessionRoute = require('./routes/session');
const userRoute = require('./routes/user');
const errorRoute = require('./routes/error');
app.use("/items", moviedbRoute.router);
app.use(
    authRoute.router, 
    userRoute.router,
    sessionRoute.router,
    errorRoute.router
);

app.get('/', (req, res) => {
    res.send(pages.index);
});

app.get('/:id', (req, res, next) => {
    if(io.sockets.adapter.rooms.has(req.params.id)){
        res.send(pages.index);
    } else {
        next();
    };
});

app.get('/*', (req, res) => {
    res.status(404).send(pages[404]);
});

const server = http.listen(PORT, (error) => {
    if (error) {
        throw error;
    }
    console.log('Server running on port', server.address().port);    
});