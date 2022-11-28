const mongoose = require('mongoose');

const credentialsSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: 'https://cineswipe.s3.eu-central-1.amazonaws.com/157-1578186_user-profile-default-image-png-clipart%5B1%5D.png'
    },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'favorite' }]
});

module.exports = mongoose.model('credentials', credentialsSchema);