import { MongoClient } from 'mongodb';

let client: MongoClient;

beforeAll(async () => {
    // Connect to the MongoDB server
    client = await MongoClient.connect('mongodb://localhost:27017/my-database');
});

// Get the 'users' collection
const users = client.db('my-database').collection('users');

// Insert a user document
await users.insertOne({ name: 'John Doe', email: 'johndoe@example.com' });

// Get the user that was just inserted
const user = await users.findOne({ name: 'John Doe' });

// Use Jest's expect() and toEqual() methods to assert that the user
// has the expected properties
expect(user).toEqual({ name: 'John Doe', email: 'johndoe@example.com' });

afterAll(async () => {
    // Close the connection to the MongoDB server
    await client.close();
});
