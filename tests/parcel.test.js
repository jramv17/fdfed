const LogController = require('../Controllers/SecurityController');
const Parcel = require('../Models/ParcelModel');

jest.mock('../Models/ParcelModel');

describe('Parcel Controller', () => {
    let req, res, logController;

    beforeEach(() => {
        logController = new LogController();
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        jest.clearAllMocks();
    });

    describe('createParcel', () => {
        it('should create a parcel and return 201', async () => {
            const mockParcel = {
                apartment_id: 'A101',
                residentName: 'John',
                parcelReachedTime: '2025-05-06T12:00:00Z',
                parcelType: 'Document',
                senderAddress: '123 Street',
                save: jest.fn()
            };

            req.body = {
                apartment_id: mockParcel.apartment_id,
                residentName: mockParcel.residentName,
                parcelReachedTime: mockParcel.parcelReachedTime,
                parcelType: mockParcel.parcelType,
                senderAddress: mockParcel.senderAddress
            };

            Parcel.mockImplementation(() => mockParcel);

            await logController.createParcel(req, res);

            expect(mockParcel.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockParcel);
        });

        it('should handle errors and return 500', async () => {
            req.body = {
                apartment_id: 'A101',
                residentName: 'John',
                parcelReachedTime: '2025-05-06T12:00:00Z',
                parcelType: 'Document',
                senderAddress: '123 Street'
            };

            Parcel.mockImplementation(() => {
                throw new Error('DB error');
            });

            await logController.createParcel(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Error creating parcel',
                error: expect.any(Error)
            });
        });
    });

    describe('getParcels', () => {
        it('should return parcels for a given apartment', async () => {
            const mockParcels = [
                { residentName: 'John', parcelType: 'Box' },
                { residentName: 'Jane', parcelType: 'Document' }
            ];

            req.params = { apartment_id: 'A101' };
            Parcel.find.mockResolvedValue(mockParcels);

            await logController.getParcels(req, res);

            expect(Parcel.find).toHaveBeenCalledWith({ apartment_id: 'A101' });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockParcels);
        });

        it('should handle errors in getParcels and return 500', async () => {
            req.params = { apartment_id: 'A101' };
            Parcel.find.mockRejectedValue(new Error('DB error'));

            await logController.getParcels(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Error fetching parcels',
                error: expect.any(Error)
            });
        });
    });
});
