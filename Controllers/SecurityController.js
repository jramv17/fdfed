const Apartment = require('../Models/RoomModel');
const ApartmentUser = require('../Models/ApartmentUserModel');
const ResidentLog = require("../Models/LogModel");
const Parcel = require('../Models/ParcelModel');
const Guest = require('../Models/GuestModel');
class LogController {
    // Method to get all residents of a specific apartment
    async getResidents(req, res) {
        const { apartment_id } = req.params; // Extract apartment_id from the URL
        try {

            // Retrieve the apartment and populate the resident_id
            const apartment = await Apartment.findOne({ apartment_id }).populate('resident_id', 'username flat_id');

            // Check if apartment exists
            if (!apartment) {
                return res.status(404).json({ error: 'Apartment not found' });
            }

            // Return only the populated resident details
            return res.json(apartment.resident_id);
        } catch (error) {
            console.log(error);
            console.error('Error fetching residents:', error);
            return res.status(500).json({ error: 'Server error' });
        }
    }

    // Method to add log details for a specific resident
    async addLogDetails(req, res) {

        const { apartment_id, name, entry_time, exit_time } = req.body;

        try {
            // Check if the resident exists
            const resident = await ApartmentUser.findOne({ username: name, apartment_id: apartment_id });

            if (!resident) {
                // Early return if the resident is not found
                return res.status(404).json({ error: 'Resident not found' });
            }

            // Create a new log entry
            const newLog = new ResidentLog({
                resident_id: apartment_id, // Assuming this is the correct field for the resident ID
                name,
                entry_time,
                exit_time,
            });

            // Save the log in the database
            await newLog.save();
            // Return success response
            return res.status(201).json({ message: 'Log added successfully', log: newLog });

        } catch (error) {
            console.error(error);

            // Return error response if something goes wrong in the try block
            return res.status(500).json({ error: 'Server error' });
        }
    }

    // Method to get log details for a specific resident
    async getLogDetails(req, res) {
        const { apartment_id } = req.params;

        try {
            // Fetch log details by resident_id and apartment_id
            const logs = await ResidentLog.find({ resident_id: apartment_id });

            // Check if logs exist
            if (logs.length === 0) {
                return res.status(200).json({ error: 'No logs found for this resident' });
            }



            // Return the filtered logs
            return res.status(200).json(logs);
        } catch (error) {
            console.error('Error fetching logs:', error);
            return res.status(500).json({ error: 'Server error' });
        }
    }

    async createParcel(req, res) {
        const { residentName, parcelReachedTime, parcelType, senderAddress, apartment_id } = req.body;
        try {
            const newParcel = new Parcel({
                apartment_id: apartment_id,
                residentName,
                parcelReachedTime,
                parcelType,
                senderAddress,
            });
            await newParcel.save();
            res.status(201).json(newParcel);
        } catch (error) {
            res.status(500).json({ message: 'Error creating parcel', error });
        }
    };

    // Function to get all parcels
    async getParcels(req, res) {
        try {
            const { apartment_id } = req.params;
            const parcels = await Parcel.find({ apartment_id: apartment_id });
            res.status(200).json(parcels);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching parcels', error });
        }
    };
    async getGuests(req, res) {
        const { apartment_id } = req.params;
        try {
            const guests = await Guest.find({ apartment_id });
            return res.status(200).json(guests);
        } catch (error) {
            console.error("Error fetching guests:", error);
            return res.status(500).json({ error: "Server error" });
        }
    }

    async addGuests(req, res) {
        try {
            const { apartment_id } = req.params; // Get from URL params
            const { flat_no, no_of_guests, guest_names } = req.body; // Get data from request body

            if (!flat_no || !no_of_guests || !guest_names || guest_names.length != no_of_guests) {
                return res.status(400).json({ error: "Invalid data provided" });
            }

            // Add each guest to the database
            const guests = [];
            for (const name of guest_names) {
                const newGuest = new Guest({ name, flat_no, apartment_id });
                const savedGuest = await newGuest.save();
                guests.push(savedGuest);
            }

            return res.status(201).json({ message: "Guests added successfully", guests });
        } catch (error) {
            console.error("Error in addGuests:", error);
            return res.status(500).json({ error: "Server error" });
        }
    }
}

module.exports = LogController;
