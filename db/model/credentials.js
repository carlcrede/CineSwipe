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
        default: 'https://www.kindpng.com/picc/m/21-214439_free-high-quality-person-icon-default-profile-picture.png'
    },
});

module.exports = mongoose.model('credentials', credentialsSchema);