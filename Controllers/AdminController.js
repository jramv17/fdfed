const dbModel = require("../Models/RoomModel");
const User =require("../Models/UserModel");
class Admin {
    constructor() {

    }

    async Adminfetch(req,res){
        try {
        const apartments =await dbModel.find();
        if(!apartments){
            return res.status(404).json({message:"No apartments found"});
        }
        const users= await User.find();
        if(!users){
            return res.status(404).json({message:"No users found"});
        }
        return res.status(200).json({ apartments, users});
    } catch (error) {
        return res.status(500).json({message:"Error fetching datastore"});
        
    }
    }




}

module.exports = Admin;