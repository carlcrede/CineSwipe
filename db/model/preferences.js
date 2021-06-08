const mongoose = require('mongoose');

const preferencesSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    likes: [{ 
        _id : false,
        id: {
            type: String,
            required: true
        },
        media_type: {
            type: String,
            required: true
        },
        genres: {
            type: [{
                _id: false,
                id: {
                    type: String,
                    required: true
                },
                name: {
                    type: String,
                    required: true
                }
            }],
        }
    }],
});

module.exports = mongoose.model('preferences', preferencesSchema);