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
        res.status(401);
        return res.send(errors);
    }
    try {
        const email = req.body.email;
        const username = req.body.username;
        const plainTextPassword = req.body.password;
        const hashedPwd = await bcrypt.hash(plainTextPassword, saltRounds);
        const insertResult = await User.create({
            email: email,
            username: username,
            password: hashedPwd
        });
        res.status(200);
        return res.send({});
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
        const foundByUsername = await User.findOne({ username: req.body.user}); //search database for a 
        const foundByEmail = await User.findOne({ email: req.body.user});
        const foundUser = (foundByUsername) ? foundByUsername : foundByEmail; //ternary operation to find user by email if not found by username;
        if (foundUser) { 
            const compared = await bcrypt.compare(req.body.password, foundUser.password);
            if (compared) {
                req.session.loggedIn = true;
                req.session.userId = req.body.user;
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

router.get('/logout', (req, res) => {
    if(req.session.userId){
        req.session.destroy();
    }
    res.redirect('/');
});

module.exports = {
    router
}