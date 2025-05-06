const request = require('supertest');
const express = require('express');
const complaintController = require('../Controllers/complaintController');
const Complaint = require('../Models/UserComplaintModel');
const ApartmentUser = require('../Models/ApartmentUserModel');
const Room = require('../Models/RoomModel');

jest.mock('../Models/UserComplaintModel');
jest.mock('../Models/ApartmentUserModel');
jest.mock('../Models/RoomModel');

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  req.id = '123';
  next();
});

app.post('/complaint', complaintController.createComplaint);
app.get('/apartment/:apartment_id', complaintController.getApartmentDetails);
app.patch('/complaint/:id', complaintController.updateIsSolved);

describe('Complaint Controller Tests', () => {
  // Suppress console.log output during tests
  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterAll(() => {
    console.log.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Create Complaint
  describe('Create Complaint', () => {
    it('should create a complaint successfully', async () => {
      ApartmentUser.findOne.mockResolvedValue({
        username: 'John Doe',
        flat_id: '101'
      });

      const mockComplaint = {
        complaintTitle: 'Leaky Pipe',
        complaintType: 'Maintenance',
        complaintDetail: 'The pipe in the bathroom is leaking.',
        anonymous: false,
        userId: '123',
        username: 'John Doe',
        apartment_id: '1',
        flat_id: '101',
        save: jest.fn().mockResolvedValue({
          toJSON: () => ({
            complaintTitle: 'Leaky Pipe',
            complaintType: 'Maintenance',
            complaintDetail: 'The pipe in the bathroom is leaking.',
            anonymous: false,
            userId: '123',
            username: 'John Doe',
            apartment_id: '1',
            flat_id: '101'
          })
        })
      };

      Complaint.mockImplementation(() => mockComplaint);

      const res = await request(app)
        .post('/complaint')
        .send({
          complaintTitle: 'Leaky Pipe',
          complaintType: 'Maintenance',
          complaintDetail: 'The pipe in the bathroom is leaking.',
          anonymous: false,
          apartment_id: '1'
        });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        complaintTitle: 'Leaky Pipe',
        complaintType: 'Maintenance',
        complaintDetail: 'The pipe in the bathroom is leaking.',
        anonymous: false,
        userId: '123',
        username: 'John Doe',
        apartment_id: '1',
        flat_id: '101'
      });
    });

    it('should return error if complaint creation fails', async () => {
      ApartmentUser.findOne.mockRejectedValue(new Error('Database error'));

      const res = await request(app)
        .post('/complaint')
        .send({
          complaintTitle: 'Broken Light',
          complaintType: 'Electrical',
          complaintDetail: 'The hallway light is broken.',
          anonymous: false,
          apartment_id: '1'
        });

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('Get Apartment Details', () => {
    it('should get complaints for the apartment', async () => {
      Room.findOne.mockResolvedValue({ owner: '123' });

      Complaint.find.mockResolvedValue([
        {
          complaintTitle: 'Leaky Pipe',
          complaintDetail: 'The pipe in the bathroom is leaking.',
        }
      ]);

      const res = await request(app).get('/apartment/1');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].complaintTitle).toBe('Leaky Pipe');
    });

    it('should return 404 if room not found', async () => {
      Room.findOne.mockResolvedValue(null);

      const res = await request(app).get('/apartment/1');

      expect(res.status).toBe(404);
    });

    it('should return 403 if user is not authorized', async () => {
      Room.findOne.mockResolvedValue({ owner: '456' });

      const res = await request(app).get('/apartment/1');

      expect(res.status).toBe(403);
    });
  });

  describe('Update Complaint Status', () => {
    it('should update complaint status successfully', async () => {
      const mockComplaint = {
        isSolved: false,
        save: jest.fn().mockResolvedValue(true)
      };
      Complaint.findById.mockResolvedValue(mockComplaint);

      const res = await request(app)
        .patch('/complaint/abc123')
        .send({ isSolved: true });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Complaint status updated successfully');
      expect(mockComplaint.isSolved).toBe(true);
    });

    it('should return error if complaint not found', async () => {
      Complaint.findById.mockResolvedValue(null);

      const res = await request(app)
        .patch('/complaint/abc123')
        .send({ isSolved: true });

      expect(res.status).toBe(404);
    });
  });
});
