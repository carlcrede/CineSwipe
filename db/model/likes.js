const mongoose = require('mongoose');

const likesSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    likes: [{ 
        _id : false,
        likeId: {
            type: String,
            required: true
        },
        media_type: {
            type: String,
            required: true
        }
    }],
});

module.exports = mongoose.model('likes', likesSchema);