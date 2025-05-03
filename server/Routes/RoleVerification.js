const express = require('express');
const route = express.Router();
const { jwt_authenticate } = require("../middlewares/PassportLoginMiddleware");
const ApartmentUser = require("../Models/ApartmentUserModel");
const Room = require("../Models/RoomModel.js");

route.use('/', jwt_authenticate);

route.get('/:role', async function (req, res) {
    const role = req.params.role;
    const userId = req.id;

    try {
        if (role === 'Security') {
            const isSecurity = await ApartmentUser.findOne({ user: userId, user_designation: role });
            if (!isSecurity) {
                return res.status(400).json({ message: "You are not a security" });
            }
            return res.status(200).json({ details: isSecurity });
        }
        else if (role === 'Owner') {
            const OwnerRooms = await Room.find({ owner: userId });
            if (!OwnerRooms || OwnerRooms.length === 0) {
                return res.status(400).json({ message: "You are not an owner" });
            }

            return res.status(200).json({ details: OwnerRooms });
        }
        // Invalid role
        else {
            return res.status(400).json({ message: "Invalid role" });
        }
    } catch (error) {
        // Handle any errors during database queries
        console.error("Error fetching data:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = route;
