const Credentials = require('../db/model/credentials')

// Insert a user document
Credentials.create({ username: 'John Doe', email: 'johndoe@example.com', password: "hashedPw" });

// Get the user that was just inserted
const user = Credentials.findOne({ username: 'John Doe' });

// Use Jest's expect() and toEqual() methods to assert that the user
// has the expected properties
expect(user.username).toEqual('John Doe');

afterAll(async () => {
    // Close the connection to the MongoDB server
    Credentials.deleteOne({username: 'John Doe'})
    const user = Credentials.findOne({ username: 'John Doe' });
    expect(user).toEqual(null);
});
