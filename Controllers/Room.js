const ApartmentData = require("../Models/UserApartmentModel");
const RoomModel = require("../Models/RoomModel");
const redis = require('redis');
const env_variables = require('../utils/envutils');
class RoomController {

    constructor() {
        this.redisClient = redis.createClient({
            username: 'default',
            password: env_variables.REDIS_PASSWORD,
            socket: {
                host: env_variables.REDIS_HOST,
                port: env_variables.REDIS_PORT
            }
        });
        this.redisClient.connect().catch(console.error);
    }
    async userRooms(req, res) {
        try {
            const cachedKey = `userRooms:${req.id}`;
            const cachedData = await this.redisClient.get(cachedKey);
            console.log('cached' + cachedData);
            if (cachedData) {
                return res.status(201).json({ details: JSON.parse(cachedData) });
            }

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
            console.log(Rooms);
            // // await redisClient.setEx(cachedKey, 60, JSON.stringify(Rooms));
             await this.redisClient.set(cachedKey, JSON.stringify(Rooms));
             await this.redisClient.expire(cachedKey, 60);



            return res.status(201).json({ details: Rooms });
        } catch (error) {
            console.log(error);
        }
    }
}


module.exports = RoomController;
