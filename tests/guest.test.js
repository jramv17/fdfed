const request = require('supertest');
const express = require('express');
const LogController = require('../Controllers/SecurityController');
const Guest = require('../Models/GuestModel');

jest.mock('../Models/GuestModel');

const app = express();
app.use(express.json());

const controller = new LogController();
app.get('/apartments/:apartment_id/guests', controller.getGuests.bind(controller));
app.post('/apartments/:apartment_id/guests', controller.addGuests.bind(controller));

beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
});
  
afterAll(() => {
    console.error.mockRestore();
});

describe('LogController - Guest Methods', () => {
    const apartment_id = '12345';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /apartments/:apartment_id/guests', () => {
        it('should return all guests for the apartment', async () => {
            const mockedGuests = [
                { _id: '1', name: 'John Doe', apartment_id },
                { _id: '2', name: 'Jane Doe', apartment_id }
            ];

            Guest.find.mockResolvedValue(mockedGuests);

            const res = await request(app).get(`/apartments/${apartment_id}/guests`);
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockedGuests);
        });

        it('should return server error on failure', async () => {
            Guest.find.mockRejectedValue(new Error('Database error'));

            const res = await request(app).get(`/apartments/${apartment_id}/guests`);
            expect(res.status).toBe(500);
            expect(res.body.error).toBe('Server error');
        });
    });

    describe('POST /apartments/:apartment_id/guests', () => {
        it('should add guests successfully', async () => {
            const reqBody = {
                flat_no: 101,
                no_of_guests: 2,
                guest_names: ['John Doe', 'Jane Doe']
            };

            const mockedGuests = reqBody.guest_names.map(name => ({
                name,
                flat_no: reqBody.flat_no,
                apartment_id
            }));

            // Mock Guest constructor and .save()
            Guest.mockImplementation(({ name, flat_no, apartment_id }) => {
                return {
                    name,
                    flat_no,
                    apartment_id,
                    save: jest.fn().mockResolvedValue({
                        name,
                        flat_no,
                        apartment_id
                    })
                };
            });

            const res = await request(app)
                .post(`/apartments/${apartment_id}/guests`)
                .send(reqBody);

            expect(res.status).toBe(201);
            expect(res.body.message).toBe('Guests added successfully');
            expect(res.body.guests).toEqual(mockedGuests);
        });

        it('should return 400 for invalid data', async () => {
            const res = await request(app)
                .post(`/apartments/${apartment_id}/guests`)
                .send({
                    flat_no: 101,
                    no_of_guests: 2,
                    guest_names: ['Only One Name']
                });

            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Invalid data provided');
        });

        it('should return 500 on save error', async () => {
            const reqBody = {
                flat_no: 101,
                no_of_guests: 2,
                guest_names: ['John Doe', 'Jane Doe']
            };

            Guest.mockImplementation(() => ({
                save: jest.fn().mockRejectedValue(new Error('Database error'))
            }));

            const res = await request(app)
                .post(`/apartments/${apartment_id}/guests`)
                .send(reqBody);

            expect(res.status).toBe(500);
            expect(res.body.error).toBe('Server error');
        });
    });
});
