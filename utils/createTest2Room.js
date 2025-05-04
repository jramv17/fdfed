const request = require('supertest');
const app = require('../app');
const UserModel = require('../Models/UserModel');

function generateRandomString(length = 8) {
  return Math.random().toString(36).substring(2, 2 + length);
}

async function getJwtCookie() {
  const random = generateRandomString();

  const pay = {
    username: `testuser_${random}`,
    email: `test_${random}@example.com`,
    password: 'securepass'
  };

  const res = await request(app)
    .post('/user/register')
    .send(pay);

  if (res.statusCode !== 200) {
    console.error("Failed to register user. Status:", res.statusCode, "Body:", res.body);
    throw new Error('Could not register user to get JWT');
  }

  const cookies = res.headers['set-cookie'] || [];
  const jwtCookie = cookies.find(cookie => cookie.startsWith('jwt='));

  if (!jwtCookie) {
    throw new Error('JWT cookie not found in response');
  }

  return { jwtCookie, email: pay.email }; // return both JWT and user email
}

async function createTestRoom(jwtCookie, email) {
  const payload = {
    name: 'Test Apartment',
    registration_num: '12848',
    state: 'TestcityState',
    address: '123 Test Street',
    flat_id: 'A2',
    pincode: '654321',
    email: 'restroom@example.com',
    subscription: 'basic',
    subscriptionStatus: 'active',
    subscriptionId: 'sub_115'
  };

  const res = await request(app)
    .post('/createRoom')
    .set('Cookie', jwtCookie)
    .send(payload);

  if (res.statusCode !== 200) {
    console.error('Room creation failed: ' + JSON.stringify(res.body));
    throw new Error('Failed to create test room');
  }

  const user = await UserModel.findOne({ email });
  if (!user) throw new Error(`User not found for email: ${email}`);

  return {
    apartment_id: res.body.room.apartment_id,
    flat_id: payload.flat_id,
    user_id: user._id.toString(),
    username: user.username
  };
}

module.exports = { createTestRoom, getJwtCookie };
