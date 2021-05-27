const mongoose = require('mongoose');

const likesSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    likes: [String]
});

module.exports = mongoose.model('likes', likesSchema);