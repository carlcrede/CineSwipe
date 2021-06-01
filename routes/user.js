const router = require('express').Router();

const Likes = require('../db/model/likes.js');

const pages = require('../util/ssr');

router.get('/user/:id', (req, res) => {
    res.send(pages.user);
});

router.get('/user/:id/preferences', (req, res) => {
    res.send(pages.preferences);
});

router.get('/likes', async(req, res) => {
    const user = req.session.userId;
    try {
        if(user){
            const foundUser = await Likes.findOne({user: user});
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
    const media_type = req.body.like.media_type
    const user = req.session.userId;
    try {
        if(user){
            const filter = { user: user }; //what to find a document with the username
            const update = { "$addToSet": { likes: [{likeId: like, media_type: media_type}]}}; //what to update in that document
            const doc = await Likes.findOneAndUpdate(filter, update, {
                new: true, 
                upsert: true //insert/create user document if filter fails 
            });
            return res.send({doc});
        } else {
            return res.send({});
        }
    } catch (error) {
        // console.log(error);
        res.status(500).send('Internal Server error occured');
    }
});

module.exports = {
    router
}