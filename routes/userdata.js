const router = require('express').Router();

const Likes = require('../db/model/likes.js');

router.post('/user/like', async(req, res) => {
    const like = req.body.like;
    const user = req.session.userId;
    try {
        if(user){
            const filter = { user: user };
            const update = { "$addToSet": { likes: like }};
            const doc = await Likes.findOneAndUpdate(filter, update, {
                new: true,
                upsert: true
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