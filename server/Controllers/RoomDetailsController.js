 const dbModel = require("../Models/RoomModel");
const ApartmentUserModel = require("../Models/ApartmentUserModel");
const userModel = require("../Models/UserModel");
const userComplaints = require("../Models/ComplaintModel");
const UserApartment = require("../Models/UserApartmentModel");
const CalenderModel = require("../Models/CalenderModel");
const { ObjectId } = require('mongodb');
class RoomDetails {
    async fetchDetails(req, res) {

        const { apartment_id } = req.params;
        try {
            const roomDetails = await dbModel.findOne({ $or: [{ apartment_id: apartment_id }, { apartment_name: apartment_id }] });
            if (!roomDetails) {
                return res.status(404).json({ message: 'Room not found' });
            }
            const ApartmentUser = await ApartmentUserModel.findOne({ apartment_id: apartment_id, user: req.id });
            if (!ApartmentUser) {
                return res.status(401).json({ message: 'Unauthorized access' });
            }
            return res.status(200).json({
                room: roomDetails,
                details: {
                    apartment_id: roomDetails.apartment_id,
                    apartment_name: roomDetails.apartment_name,
                    ownername: roomDetails.ownername,
                    start_date: roomDetails.createdAt,
                    number_of_residents: roomDetails.resident_id ? roomDetails.resident_id.length : 0,
                    user_id: req.id,
                    role: ApartmentUser.user_designation,
                    isAuthority: ApartmentUser.user_designation === 'Owner' || ApartmentUser.user_designation === 'Authority' || ApartmentUser.user_designation === 'Security',
                    username: ApartmentUser.username

                }
            });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async ComplaintFilebyOwner(req, res) {
        try {
            const { apartment_id, user_id, complaint, severity } = req.body;
            const Usercomplaint = new userComplaints({
                user: user_id,
                complaint: complaint,
                severity: severity,
                apartment_id: apartment_id
            });
            await Usercomplaint.save();
            res.status(200).json(Usercomplaint);
        } catch (error) {

            return res.status(500).json({ error: error.message });
        }
    }

    async RoleModification(req, res) {
        const { apartment_id, username, role } = req.body;
        const user_id = new ObjectId(username);
        try {
            const ApartmentUser = await ApartmentUserModel.findOne({ apartment_id: apartment_id, user: user_id });
            if (!ApartmentUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            else if (role === 'Security') {
                const SecurityUser = await ApartmentUserModel.findOne({ user: user_id, user_designation: 'Security' });
                if (SecurityUser) {
                    return res.status(400).json({ message: 'User already has a Security role' });
                }

            }
            ApartmentUser.user_designation = role;
            await ApartmentUser.save();
            return res.status(200).json(ApartmentUser);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: error.message });
        }
    }

    async DeleteUsers(req, res) {
        const { apartment_id, username } = req.body;

        try {
            // Find the user in the ApartmentUser model using the username string
            const ApartmentUser = await ApartmentUserModel.findOneAndDelete({ apartment_id, username });

            if (!ApartmentUser) {
                return res.status(404).json({ message: 'User not found' });
            }


            // Find the room by apartment_id
            const room = await dbModel.findOne({ apartment_id });

            if (room && room.resident_id && room.resident_id.includes(ApartmentUser._id)) {
                // Remove the user's ID from resident_id array
                room.resident_id = room.resident_id.filter((residentId) => !residentId.equals(ApartmentUser._id));
                await room.save();
            }


            // Find the user's apartments list
            const user_rooms = await UserApartment.findOne({ user: ApartmentUser.user });

            if (user_rooms && user_rooms.apartments.includes(room._id)) {
                // Remove the apartment ID from the user's apartments list
                user_rooms.apartments = user_rooms.apartments.filter((apartmentId) => !apartmentId.equals(room._id));
                await user_rooms.save();
            }


            return res.status(200).json({ message: "Successfully removed user" });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: error.message });
        }

    }
    async RoomDetails(req, res) {
        const { apartment_id } = req.params;
        try {
            const room = await dbModel.findOne({ apartment_id });
            if (!room) {
                return res.status(404).json({ message: 'Room not found' });
            }

            const ApartmentUsers = await ApartmentUserModel.find({ apartment_id: apartment_id });
            const users = await Promise.all(ApartmentUsers.map(async (user) => {
                const userDetails = await userModel.findById(user.user);
                return {
                    user_id: user.user,
                    username: userDetails.username,
                    apartment_name: user.username,
                    role: user.user_designation,
                    email: userDetails.email,
                    isAuthority: user.user_designation === 'Owner' || user.user_designation === 'Authority' || user.user_designation === 'Security'
                };
            }));

            return res.status(200).json({ roomdetails: room, apartment_users: users });
        } catch (error) {
            return res.status(500).json({ error: error.message });

        }
    }

    async ScheduleEvent(req, res) {
        try {
            const { apartment_id, date, event } = req.body;

            const Details = await CalenderModel.findOne({ apartment_id });
            if (!Details) {
                const newDetails = new CalenderModel({
                    apartment_id: apartment_id,
                    events: [{
                        event: event,
                        date: date
                    }]
                });
                await newDetails.save();
            } else {
                Details.events.push({
                    event: event,
                    date: date
                });
                await Details.save();
            }
            return res.status(200).json({ message: "Event scheduled successfully" });

        } catch (error) {
            return res.status(500).json({ message: "Error saving details" });

        }

    }
}


module.exports = RoomDetails;