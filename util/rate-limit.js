const rateLimit = require('express-rate-limit');

const api = rateLimit({
    windowMs: 30 * 1000,
    max: 10
});

const auth = rateLimit({
    windowMs: 30 * 1000,
    max: 10
});

module.exports = {
    api, auth
}