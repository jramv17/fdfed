const request = require('supertest');
const app = require('../app');

async function createTestRoom(jwtCookie) {
    const payload = {
        name: 'Test Apartment',
        registration_num: '123456',
        state: 'TestState',
        address: '123 Test Street',
        flat_id: 'A1',
        pincode: '123456',
        email: 'testroom@example.com',
        subscription: 'basic',
        subscriptionStatus: 'active',
        subscriptionId: 'sub_123'
    }
    const res = await request(app)
        .post('/createRoom')
        .set('Cookie', jwtCookie)
        .send(payload);

    if (res.statusCode !== 200) {
        console.log('Room creation failed: ' + JSON.stringify(res.body));
    }
   

    return {
        apartment_id: res.body.room.apartment_id,
        flat_id: payload.flat_id
    };
}

module.exports = { createTestRoom }