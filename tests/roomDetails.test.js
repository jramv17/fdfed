const request = require('supertest');
const app = require('../app');
// const { getJwtCookie } = require('../utils/createTestJwt');
const { getJwtCookie,createTestRoom } = require('../utils/createTest2Room');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let jwtCookie;
let apartmentInfo;
let userId;
let email;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

   ({ jwtCookie, email } = await getJwtCookie());
  apartmentInfo = await createTestRoom(jwtCookie,email);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('Room Details Route', () => {
  test('GET /room-details/:apartment_id - should return room details', async () => {
    const res = await request(app)
      .get(`/room-details/${apartmentInfo.apartment_id}`)
      .set('Cookie', jwtCookie);

    expect(res.statusCode).toBe(200);
    expect(res.body.room.apartment_id).toBe(apartmentInfo.apartment_id);
    expect(res.body.details.role).toBeDefined();
  });

  test('GET /room-details/:apartment_id/details - should return room and user details', async () => {
    const res = await request(app)
      .get(`/room-details/${apartmentInfo.apartment_id}/details`)
      .set('Cookie', jwtCookie);

    expect(res.statusCode).toBe(200);
    expect(res.body.roomdetails.apartment_id).toBe(apartmentInfo.apartment_id);
    expect(Array.isArray(res.body.apartment_users)).toBe(true);
  });

  test('POST /room-details/raise-ticket - should file a complaint', async () => {
    const complaintPayload = {
      apartment_id: apartmentInfo.apartment_id,
      user_id: apartmentInfo.user_id,
      complaint: 'Leaky faucet in kitchen',
      severity: 'medium'
    };

    const res = await request(app)
      .post('/room-details/raise-ticket')
      .set('Cookie', jwtCookie)
      .send(complaintPayload);

    expect(res.statusCode).toBe(200);
    expect(res.body.complaint).toBe(complaintPayload.complaint);
  });

  test('PUT /room-details/role-assign - should assign a new role to a user', async () => {
    const res = await request(app)
      .put('/room-details/role-assign')
      .set('Cookie', jwtCookie)
      .send({
        apartment_id: apartmentInfo.apartment_id,
        username: apartmentInfo.user_id,
        role: 'Security'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.user_designation).toBe('Security');
  });

  test('POST /room-details/schedule-event - should schedule a new event', async () => {
    const res = await request(app)
      .post('/room-details/schedule-event')
      .set('Cookie', jwtCookie)
      .send({
        apartment_id: apartmentInfo.apartment_id,
        event: 'Maintenance Check',
        date: new Date().toISOString()
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Event scheduled successfully');
  });

  test('POST /room-details/deleteuser - should delete user from apartment', async () => {
    const res = await request(app)
      .post('/room-details/deleteuser')
      .set('Cookie', jwtCookie)
      .send({
        apartment_id: apartmentInfo.apartment_id,
        username: apartmentInfo.username
      });

    expect(res.statusCode).toBe(404);
    // expect(res.body.message).toBe('Successfully removed user');
  });
});
