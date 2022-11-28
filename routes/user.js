const router = require('express').Router();
const Users = require('../db/model/credentials.js');
const Preferences = require('../db/model/preferences.js');
const Favorites = require('../db/model/favorites.js');
const authenticateToken = require('../middleware/auth.js');
const upload = require('../middleware/multer.js').single('profilePicture');
const multer = require('multer');

// get user information / user profile
router.get('/me', authenticateToken, async (req, res) => {
    const user = await Users.findById(req.userId, { password: 0 }).populate('favorites');
    if (user) {
        res.send(user);
    } else {
        res.status(404).send('User not found');
    }
});

// edit user information
router.put('/me', authenticateToken, async (req, res) => {
    const body = req.body;
    if (!body.email || !body.username) {
        return res.status(400).send('Invalid request');
    }
    // check if user with email or username already exists
    const userHasEmail = await Users.findOne({ email: body.email, _id: { $ne: req.userId } });
    const userHasUsername = await Users.findOne({ username: body.username, _id: { $ne: req.userId } });

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

// upload profile picture
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

// add favorite
router.post('/me/favorites', authenticateToken, async (req, res) => {
    const body = req.body;
    if (!body.movieDbId) {
        return res.status(400).send('Missing movieDbId');
    }
    const user = await Users.findById(req.userId);
    if (!user) {
        return res.status(404).send('User not found');
    }
    // check if favorite already exists
    const _favorite = await Favorites.findOne({ user: req.userId, movieDbId: body.movieDbId });
    if (_favorite) {
        return res.status(400).send('Favorite already exists');
    }
    const favorite = new Favorites({
        user: req.userId,
        media_type: body.media_type,
        movieDbId: body.movieDbId
    });
    favorite.save(err => {
        if (err) {
            return res.status(500).send('Error saving favorite');
        }
    });
    user.favorites.push(favorite);
    user.save(err => {
        if (err) {
            return res.status(500).send('Error saving user');
        }
    });
    res.send(favorite);
});

// delete favorite / un-favorite
router.delete('/me/favorites/:id', authenticateToken, async (req, res) => {
    const favorite = await Favorites.findById(req.params.id);
    if (!favorite) {
        return res.status(404).send('Favorite not found');
    }
    if (favorite.user.toString() !== req.userId) {
        return res.status(401).send('Unauthorized');
    }
    await favorite.remove();
    res.send(favorite);
});

// get favorites for user
router.get('/me/favorites', authenticateToken, async (req, res) => {
    const favorites = await Favorites.find({ user: req.userId });
    if (!favorites) {
        return res.status(404).send('Favorites not found');
    }
    res.send(favorites);
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