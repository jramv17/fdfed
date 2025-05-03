const mongoose = require('mongoose');
const userSocketSchema = new mongoose.Schema({
    username: String,
    socketId: String,
    isLogged: { type: Boolean, default: false}
});
const userSocket=mongoose.model('userSocket',userSocketSchema);
module.exports=userSocket;