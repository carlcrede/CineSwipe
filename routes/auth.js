const router = require('express').Router();

const { body, validationResult } = require('express-validator');

const User = require('../db/model/user.js');

const bcrypt = require('bcrypt');
const saltRounds = 12;

router.post('/register', async (req, res) => {
    try {
        const username = req.body.username;
        const plainTextPassword = req.body.password;
        const hashedPwd = await bcrypt.hash(plainTextPassword, saltRounds);
        const insertResult = await User.create({
            user: username,
            pass: hashedPwd
        });
        res.send({insertResult});
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server error occured");
    }
});

router.post('/login', 
    body('username').escape(),
    body('password').escape(),
    async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
      return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await User.findOne({ user: req.body.username });
        if (user) {
            const cmp = await bcrypt.compare(req.body.password, user.pass);
            if (cmp) {
                // further code to maintain authentication like jwt or sessions
                res.redirect('/');
            } else {
                res.send("Wrong username or password.");
            } 
        } else {
            res.send("Wrong username or password.");
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server error occured");
    }
});

module.exports = {
    router
}