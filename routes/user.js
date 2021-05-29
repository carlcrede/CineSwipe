const router = require('express').Router();

const Likes = require('../db/model/likes.js');

router.post('/user/like', async(req, res) => {
    // console.group('user liked an item');
    // console.log({userId: req.session.userId});
    // console.log({id: req.body.like.id});
    // console.log({media_type: req.body.like.media_type});
    // console.groupEnd();

    const like = req.body.like.id;
    //TODO count media_type likes in database (add media_types to schema)
    const media_type = req.body.like.media_type
    const user = req.session.userId;
    try {
        if(user){
            const filter = { user: user }; //what to find a document with
            const update = { "$addToSet": { likes: like }}; //what to update in that document
            const doc = await Likes.findOneAndUpdate(filter, update, {
                new: true, 
                upsert: true //insert/create user document if filter fails 
            });
            return res.send({doc});
        } else {
            return res.send({});
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server error occured');
    }
});

module.exports = {
    router
}