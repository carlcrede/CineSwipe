const router = require('express').Router();
const Users = require('../db/model/credentials.js');
const Preferences = require('../db/model/preferences.js');
const authenticateToken = require('../middleware/auth.js');
const upload = require('../util/multer.js').single('profilePicture');
const multer = require('multer');

router.get('/me', authenticateToken, async (req, res) => {
    const user = await Users.findById(req.userId, { password: 0 });
    if (user) {
        res.send(user);
    } else {
        res.status(404).send('User not found');
    }
});

router.put('/me', authenticateToken, async (req, res) => {
    const body = req.body;
    if (!body.email || !body.username) {
        return res.status(400).send('Invalid request');
    }
    // check if user with email or username already exists
    const userHasEmail = await Users.findOne({ email: body.email, _id: { $ne: req.userId } });
    const userHasUsername = await Users.findOne({ username: body.username, _id: { $ne: req.userId }});

    if (userHasEmail) {
        res.status(400).send('Email already exists');
    } else if (userHasUsername) {
        res.status(400).send('Username already exists');
    } else {
        // update user
        const x = await Users.findByIdAndUpdate(req.userId, body, { new: true });
        res.send(x);
    }
});

router.put('/me/profile-picture', authenticateToken, async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            if (err instanceof multer.MulterError) {
                res.status(500).send('Multer error');
            } else {
                res.status(400).send('Invalid file type, only JPEG and PNG is allowed!');
            }
        } else {
            const user = await Users.findByIdAndUpdate(req.userId, { profilePicture: req.file.location }, { new: true });
            res.send(user);
        }
    });
});


router.get('/likes', async (req, res) => {
    const user = req.session.userId;
    try {
        if (user) {
            const foundUser = await Preferences.findOne({ user: user });
            const userLikes = foundUser.likes;
            res.send(userLikes);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server error occured');
    }
});

router.post('/likes', async (req, res) => {
    const like = req.body.like.id;
    const media_type = req.body.like.media_type;
    const genres = req.body.like.genres;
    const user = req.session.userId;
    try {
        if (user) {
            const filter = { user: user };
            const update = { "$addToSet": { likes: [{ id: like, media_type: media_type, genres: genres }] } };
            const doc = await Preferences.findOneAndUpdate(filter, update, {
                new: true,
                upsert: true
            });
            return res.send({ doc });
        } else {
            return res.send({});
        }
    } catch (error) {
        res.status(500).send('Internal Server error occured');
    }
});

module.exports = {
    router
}