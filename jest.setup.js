const request = require('supertest');
const {MongoMemoryServer} = require('mongodb-memory-server');
const mongoose = require('mongoose');
const User = require('./backend/models/userModel');
const app = require("./backend/app");

let mongod;

beforeAll(async () => {
    await setupTestMongo();
    await setupLoggedInAgent();
});

afterEach(async () => {
    const collections = await mongoose.connection.db.collections();
    await Promise.all(
        collections
            .filter(c => c.collectionName !== 'users')
            .map(c => c.deleteMany({}))
    );
});

afterAll(async () => {
    await mongoose.connection.close();
    if (mongod) {
        await mongod.stop();
    }
});

async function setupLoggedInAgent() {
    const agent = request.agent(app);
    const {email, password} = await createTestUser();
    await agent.post('/api/user/login')
        .send({email, password})
        .expect(201);
    global.agent = agent;
}

async function setupTestMongo() {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri, {dbName: 'test'});
}

async function createTestUser() {
    const plainPassword = 'password123';
    const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        gender: 'male',
        password: plainPassword,
    });
    return {
        id: user._id,
        email: user.email,
        password: plainPassword,
    };
}
