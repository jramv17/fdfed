const LogController = require('../Controllers/SecurityController');
const ApartmentUser = require('../Models/ApartmentUserModel');
const ResidentLog = require('../Models/LogModel');

jest.mock('../Models/ApartmentUserModel');
jest.mock('../Models/LogModel');

describe('LogController - addLogDetails', () => {
    let logController;
    let mockReq, mockRes;

    beforeEach(() => {
        logController = new LogController();

        mockReq = {
            body: {
                apartment_id: 'A101',
                name: 'JohnDoe',
                entry_time: '2025-05-06T10:00:00Z',
                exit_time: '2025-05-06T12:00:00Z',
            }
        };

        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    it('should return 404 if resident is not found', async () => {
        ApartmentUser.findOne.mockResolvedValue(null);

        await logController.addLogDetails(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({ error: 'Resident not found' });
    });

    it('should add log if resident exists', async () => {
        ApartmentUser.findOne.mockResolvedValue({ username: 'JohnDoe' });
        ResidentLog.mockImplementation(() => ({
            save: jest.fn().mockResolvedValue(true),
        }));

        await logController.addLogDetails(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Log added successfully',
                log: expect.any(Object),
            })
        );
    });
});
