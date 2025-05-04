const request = require('supertest');
const app = require('../app');

async function getJwtCookie() {
  const res = await request(app)
    .post('/user/register')
    .send({
      username: 'testuser',
      email: 'test@example.com',
      password: 'securepass'
    });

  if (res.statusCode !== 200) {
    console.error("Failed to register user. Status:", res.statusCode, "Body:", res.body);
    throw new Error('Could not register user to get JWT');
  }

  const cookies = res.headers['set-cookie'] || [];
  const jwtCookie = cookies.find(cookie => cookie.startsWith('jwt='));

  if (!jwtCookie) {
    throw new Error('JWT cookie not found in response');
  }

  return jwtCookie;
}

module.exports = { getJwtCookie };
