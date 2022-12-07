const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favoriteSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'credentials' },
    media_type: { type: String, required: true },
    movieDbId: { type: String, required: true },
    title: { type: String, required: true },
    poster_path: { type: String, required: true },
});

module.exports = mongoose.model('favorite', favoriteSchema);