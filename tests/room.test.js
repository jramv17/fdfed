const app = require('../app');
const request = require('supertest');
const { getJwtCookie } = require('../utils/createTestJwt');
const dbModel = require('../Models/RoomModel');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let jwtCookie;
let createdApartmentId;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    jwtCookie = await getJwtCookie();
});



//clean the db before each test

// beforeEach(async () => {
//     await User.deleteMany({});
// });


afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
});


describe('User Room Routes', () => {

    test('POST /createRoom/verify-registration-num - should confirm reg number is available', async () => {
        const res = await request(app)
            .post('/createRoom/verify-registration-num')
            .set('Cookie', jwtCookie)
            .send({ registration_num: '123456' });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Registration number is available');
    });

    test('POST /createRoom - should create a new room', async () => {
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
        };

        const res = await request(app)
            .post('/createRoom')
            .set('Cookie', jwtCookie)
            .send(payload);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Room created successfully');
        expect(res.body.room).toHaveProperty('apartment_id');
        createdApartmentId = res.body.room.apartment_id;
    });

    test('POST /createRoom - should fail for duplicate registration number', async () => {
        const payload = {
            name: 'Another Apartment',
            registration_num: '123456', 
            state: 'OtherState',
            address: '456 Other Street',
            flat_id: 'B2',
            pincode: '654321',
            email: 'duplicate@example.com',
            subscription: 'premium',
            subscriptionStatus: 'active',
            subscriptionId: 'sub_456'
        };

        const res = await request(app)
            .post('/createRoom')
            .set('Cookie', jwtCookie)
            .send(payload);

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('Registration number already in use');
    });

    test('PUT /createRoom/edit-email - should update emergency email', async () => {
        const res = await request(app)
            .put('/createRoom/edit-email')
            .set('Cookie', jwtCookie)
            .send({
                apartment_id: createdApartmentId,
                email: 'updatedemail@example.com'
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Emergency email updated successfully');

        const updatedRoom = await dbModel.findOne({ apartment_id: createdApartmentId });
        expect(updatedRoom.emergency_email).toBe('updatedemail@example.com');
    });

    test('PUT /createRoom/edit-email - should return 404 if apartment does not exist', async () => {
        const res = await request(app)
            .put('/createRoom/edit-email')
            .set('Cookie', jwtCookie)
            .send({
                apartment_id: 'non-existent-id',
                email: 'nochange@example.com'
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('Apartment not found or no changes made');
    });
});
