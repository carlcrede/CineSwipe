const mongoose = require('mongoose');
const url = process.env.ATLAS_URI;

mongoose.connect(url, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useFindAndModify: false
});

const connection = mongoose.connection;

connection.on('open', () => {
    console.log('mongoose connected...');
});

module.exports = {
    connection
}