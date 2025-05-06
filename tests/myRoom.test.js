const request = require('supertest');
const app = require('../app');
const { getJwtCookie } = require('../utils/createTestJwt');
const { createTestRoom } = require('../utils/createTestRoom');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { createClient } = require('redis-mock');
const redisClient = createClient();
jest.mock('../config/redisClient', () => {
  const { createClient } = require('redis-mock');
  const mockRedisClient = createClient();

  return {
    redisClient: mockRedisClient,
  };
});

let mongoServer;
let jwtCookie;
let apartmentInfo;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,

  });

  jwtCookie = await getJwtCookie();
  apartmentInfo = await createTestRoom(jwtCookie);

  if (!redisClient.isOpen?.()) {
    await redisClient.connect?.(); // Depending on redis-mock version
  }

});

// afterAll(async () => {
//   await mongoose.connection.dropDatabase();
//   await mongoose.connection.close();
//   await mongoServer.stop();
// });
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
  
  if (redisClient.quit) {
    await redisClient.quit();
  }
});

describe('GET /my-rooms', () => {
  test('should return room details for authenticated user', async () => {
    const res = await request(app)
      .get('/my-rooms')
      .set('Cookie', jwtCookie);

    expect(res.statusCode).toBe(201);
    expect(res.body.details).toBeDefined();
    expect(Array.isArray(res.body.details)).toBe(true);
    expect(res.body.details[0]).toHaveProperty('apartment_id');
    expect(res.body.details[0]).toHaveProperty('apartment_name');
    expect(res.body.details[0]).toHaveProperty('number_of_residents');
  });

  test('should return "No apartments found" for user with no rooms', async () => {
    const newUserCookie = await getJwtCookie();

    const res = await request(app)
      .get('/my-rooms')
      .set('Cookie', newUserCookie);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('No apartments found');
  });

  test('should return "User not found" for completely unknown user', async () => {
    const fakeUserId = new mongoose.Types.ObjectId();
    const UserApartmentModel = require('../Models/UserApartmentModel');
    await UserApartmentModel.deleteMany({});

    const res = await request(app)
      .get('/my-rooms')
      .set('Cookie', jwtCookie);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('User not found');
  });
});
