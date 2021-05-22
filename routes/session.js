const session = require('express-session');

const router = require('express').Router();

router.get('/session/id', (req, res) => {
    res.send({ userId: req.session.userId});
});

router.get('/session/errors', (req, res) => {
    if(req.session.errors){
        res.send({ errors: req.session.errors.errors});
    } else {
        res.send({});
    }
});

router.get('/session/loginfailed', (req, res) => {
    if(req.session.loginfailed){
        res.send({ msg: req.session.loginfailed});
    } else {
        res.send({});
    }
});

module.exports = {
    router
}