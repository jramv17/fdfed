const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    userId: String,
    msg: String,
    to: String,
    aptId: String,
    time: String,
    deleteForAll: {
        type: Boolean,
        default: false,
    },
    timestamp: { type: Date, default: Date.now }


},
    {
        timestamps: true,
    });

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;