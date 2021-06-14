const router = require('express').Router();

const pages = require('../util/ssr');

router.get('/error/404', (req, res) => {
    res.send(pages.error[404]);
});

router.get('/error/500', (req, res) => {
    res.send(pages.error[500]);
});

module.exports = {
    router
}