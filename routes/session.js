const router = require('express').Router();

router.get('/session/id', (req, res) => {
    res.send({ userId: req.session.userId});
});

module.exports = {
    router
}