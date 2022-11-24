const router = require('express').Router();
const Users = require('../db/model/credentials.js');
const Preferences = require('../db/model/preferences.js');
const authenticateToken = require('../middleware/auth.js');

router.get('/me', authenticateToken, async (req, res) => {
    const user = await Users.findById(req.userId, {password: 0});
    if (user) {
        res.send(user);
    } else {
        res.status(404).send('User not found');
    }
});

router.get('/likes', async(req, res) => {
    const user = req.session.userId;
    try {
        if(user){
            const foundUser = await Preferences.findOne({user: user});
            const userLikes = foundUser.likes;
            res.send(userLikes);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server error occured');
    }
});

router.post('/likes', async(req, res) => {
    const like = req.body.like.id;
    const media_type = req.body.like.media_type;
    const genres = req.body.like.genres;
    const user = req.session.userId;
    try {
        if(user){
            const filter = { user: user };
            const update = { "$addToSet": { likes: [{id: like, media_type: media_type, genres: genres}]}};
            const doc = await Preferences.findOneAndUpdate(filter, update, {
                new: true, 
                upsert: true
            });
            return res.send({doc});
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