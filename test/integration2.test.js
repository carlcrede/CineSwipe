const { MongoClient, ObjectId } = require('mongodb')
require('dotenv').config();

describe('DB', () => {
    let connection;
    let db;

    beforeAll(async () => {
        const mongoUrl = process.env.ATLAS_URI
        connection = await MongoClient.connect(mongoUrl)
        db = connection.db()
    })

    afterAll(async () => {
        await connection.close()
    })

    it('should insert a user into collection', async () => {
        const users = db.collection('users')
        const newObjectId = new ObjectId()
        const mockUser = { _id: newObjectId, username: 'John Doe', email: 'johndoe@example.com', password: "hashedPw" }
        await users.insertOne(mockUser)

        const insertedUser = await users.findOne({ _id: newObjectId })
        expect(insertedUser).toEqual(mockUser)
    })
    it('should insert a doc into collection', async () => {
        const allUsers = await db.collection('users').find().toArray()

        expect(allUsers.length).toBeGreaterThan(0)
    })

})