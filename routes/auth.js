const router = require('express').Router();
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

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ user: req.body.username });
        if (user) {
            const cmp = await bcrypt.compare(req.body.password, user.pass);
            if (cmp) {
                // further code to maintain authentication like jwt or sessions
                res.send("Auth Successful");
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