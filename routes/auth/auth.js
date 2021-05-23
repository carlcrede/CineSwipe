const router = require('express').Router();

//server side rendering
const pages = require('../../util/ssr');

//express-validator for form validation
const { body, check, checkSchema, validationResult } = require('express-validator');

//javascript objects/schemas to be used with express-validator
const schema = require('./validation-schema');

//mongoose User model
const User = require('../../db/model/user.js');

//password hashing
const bcrypt = require('bcrypt');
const saltRounds = Number(process.env.BCRYPT_SALTROUNDS);

/* ______________________________________________________________________________ */
//routes
router.get('/register', (req, res) => {
    res.send(pages.register);
});

router.post('/register', checkSchema(schema.register), async (req, res) => {
    //if express-validator validationResult contains any errors then form data is invalid
    //see -> validation-schema for details
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.session.errors = errors;
        return res.redirect('/register');
    }
    try {
        const email = req.body.email;
        const username = req.body.username;
        const plainTextPassword = req.body.password;
        const hashedPwd = await bcrypt.hash(plainTextPassword, saltRounds);
        const insertResult = await User.create({
            email: email,
            user: username,
            pass: hashedPwd
        });
        res.cookie('registration_success', 'true', { expires: new Date(Date.now() + 5000), httpOnly: false, secure: false});
        res.redirect('/login');
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server error occured");
    }
});

router.get('/login', (req, res) => {
    if(req.session.userId){
        res.redirect('/');
    } else {
        res.send(pages.login);
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ user: req.body.username });
        if (user) {
            const cmp = await bcrypt.compare(req.body.password, user.pass);
            if (cmp) {
                // further code to maintain authentication like jwt or sessions
                const expiry = new Date(Date.now() + 10000);
                // req.cookie.maxAge = 10000;
                res.cookie('login_success', 'true', { expires: new Date(Date.now() + 5000), httpOnly: false, secure: false});
                req.session.loggedIn = true;
                req.session.userId = req.body.username;
                res.status(200);
                res.send({msg: 'Authorized'});
            } else {
                res.status(401);
                res.send({msg: 'Invalid password or username'});
            }
        } else {
            res.status(401);
            res.send({msg: 'Invalid password or username'});
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server error occured');
    }
});

router.post('/logout', (req, res) => {
    if(req.session.userId){
        req.session.destroy();
    }
    res.redirect('/');
});

module.exports = {
    router
}