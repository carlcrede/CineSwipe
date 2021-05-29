const mongoose = require('mongoose');
const user = process.env.MONGODB_USER;
const pass = process.env.MONGODB_PASS;
const url = `mongodb+srv://${user}:${pass}@cluster0.hkbey.mongodb.net/auth?retryWrites=true&w=majority`
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