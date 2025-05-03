const ApartmentData = require("../Models/UserApartmentModel");
const RoomModel = require("../Models/RoomModel");
class RoomController {
    async userRooms(req, res) {
        const userRooms = await ApartmentData.findOne({ user: req.id });
        if (!userRooms) {
            return res.status(200).json({ message: "User not found" });
        }
        if (userRooms.apartments?.length == 0) {
            return res.status(200).json({ message: "No apartments found" });
        }
        const Rooms = await Promise.all(
            userRooms.apartments.map(async (id) => {
                const room = await RoomModel.findById(id);
                return {
                    apartment_id: room.apartment_id,
                    apartment_name: room.apartment_name,
                    ownername: room.ownername,
                    start_date: room.createdAt,
                    avatar: room.avatar,
                    number_of_residents: room.resident_id ? room.resident_id.length : 0
                };
            })
        );
        return res.status(201).json({ details: Rooms });
    }
}


module.exports = RoomController;