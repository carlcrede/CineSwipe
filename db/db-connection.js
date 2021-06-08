const mongoose = require('mongoose');
const url = process.env.MONGODB_URL;

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