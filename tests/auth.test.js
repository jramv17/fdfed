const request = require('supertest');
const app = require('../index.js');
const mongoose = require('mongoose');
const User = require('../Models/UserModel.js');
// const env_variables=require('../utils/envutils.js');
const { MongoMemoryServer } = require('mongodb-memory-server');

//make a local instance of db
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});


//clean the db before each test

beforeEach(async () => {
    await User.deleteMany({});
});


afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
});


describe('User Authentication Routes', () => {
    test('POST /user/register - should register a new user', async () => {
      const res = await request(app)
        .post('/user/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'securepass'
        });
  
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('username', 'testuser');
      expect(res.body).toHaveProperty('email', 'test@example.com');
      expect(res.body).toHaveProperty('uuid');
    });
  
    test('POST /user/register - should not allow duplicate registration', async () => {
      await request(app)
        .post('/user/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'securepass'
        });
  
      const res = await request(app)
        .post('/user/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'securepass'
        });
  
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch('Username or email already in use');
    });
  
    test('GET /user/logout - should clear cookie and return success message', async () => {
      const res = await request(app)
        .get('/user/logout');
  
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Successfully logged out');
    });
  });