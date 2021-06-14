const router = require('express').Router();

router.get('/session/userid', (req, res) => {
    res.send({ userId: req.session.userId});
});

module.exports = {
    router
}