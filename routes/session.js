const router = require('express').Router();

router.get('/session/id', (req, res) => {
    res.send({ userId: req.session.userId});
});

router.get('session/errors', (req, res) => {
    res.send({ errors: req.session.userId});
});

module.exports = {
    router
}