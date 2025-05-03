const dbModel = require("../Models/RoomModel");
const UserApartment = require("../Models/ApartmentUserModel");
const User = require("../Models/UserModel");
const userComplaintsModel = require("../Models/ComplaintModel");
class DashBoardController {
    async UserApartmentDetails(req, res) {
        try {
            const userApartments = await UserApartment.find({ user: req.id });

            if (!userApartments || userApartments.length === 0) {
                return res.status(404).json({ message: "User not found or no apartments" });
            }

            const apartments = await Promise.all(
                userApartments.map(async (userApartment) => {
                    const room = await dbModel.findOne({ apartment_id: userApartment.apartment_id });
                    if (!room) {
                        return { message: `No room found for apartment_id ${userApartment.apartment_id}`, username: userApartment.username };
                    }
                    return { ...room.toObject(), username: userApartment.username, flat_id: userApartment.flat_id, designation: userApartment.user_designation };
                })
            );

            return res.status(200).json({ apartments });

        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: error.message });
        }
    }

    async UserDashDetails(req, res) {
        try {
            // Fetch user, user complaints, and apartments data in parallel
            const user = await User.findById(req.id);
            const userComplaints = await userComplaintsModel.find({ user: req.id });
            const apartments = await UserApartment.find({ user: req.id });

            // Map over userComplaints to fetch apartment details and complaints
            const apartment_complaints_for_users = await Promise.all(
                userComplaints.map(async (ele) => {
                    // Fetch apartment details for each complaint
                    const room = await dbModel.findOne({ apartment_id: ele.apartment_id });

                    // Return a new object with complaints and apartment information
                    return {
                        complaints: ele.complaint,
                        severity: ele.severity,
                        createdAt: ele.createdAt,
                        apartment_name: room ? room.apartment_name : 'Unknown' // Fallback if apartment not found
                    };
                })
            );

            // Return the user details, complaints, and mapped apartment complaints
            return res.status(200).json({
                user: user,
                complaints: apartment_complaints_for_users,
                apartments: apartments
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        }
    }
    async ApartmentResidents(req, res) {
        try {
            const { apartment_id } = req.params;
            if (!apartment_id) {
                return res.status(400).json({ message: "apartment_id is required" });
            }
            const residents = await UserApartment.find({ apartment_id });
            return res.status(200).json({ residents });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        }

    }




}

module.exports = DashBoardController;
