const app = require('../app');
const request = require('supertest');
const { getJwtCookie } = require('../utils/createTestJwt');
const { createTestRoom } = require('../utils/createTestRoom');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

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
});


afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
});

describe('Join Room Route', () => {
  test('POST /join-room - should join the room successfully', async () => {
    const res = await request(app)
      .post('/join-room')
      .set('Cookie', jwtCookie)
      .send({
        apartment_id: apartmentInfo.apartment_id,
        flat_id: `B${Math.floor(Math.random() * 100)}`
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Room joined successfully');
  });

  test('POST /join-room - should return already a resident', async () => {
    const res = await request(app)
      .post('/join-room')
      .set('Cookie', jwtCookie)
      .send({
        apartment_id: apartmentInfo.apartment_id,
        flat_id: apartmentInfo.flat_id  
      });
  
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe(`Flat number ${apartmentInfo.flat_id} is already occupied by another resident`);
  });
  

  test('POST /join-room - should fail when flat is occupied', async () => {
    const newCookie = await getJwtCookie(); 
    const res = await request(app)
      .post('/join-room')
      .set('Cookie', newCookie)
      .send({
        apartment_id: apartmentInfo.apartment_id,
        flat_id: apartmentInfo.flat_id 
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/already occupied/i);
  });

  test('POST /join-room - should return 404 for invalid apartment', async () => {
    const res = await request(app)
      .post('/join-room')
      .set('Cookie', jwtCookie)
      .send({
        apartment_id: 'nonexistent-apartment',
        flat_id: 'Z1'
      });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Room not found');
  });
});
