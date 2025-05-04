const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({

    apartment_username: { type: String, required: true },
    apartment_id: { type: String, required: true },
    user_designation: { type: String, required: true },
    announcement_msg: { type: String, required: true },
    fileUrl:{type:String},
    filename:{type:String},
    timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

const Announcement = mongoose.model('Announcement', AnnouncementSchema);

module.exports = Announcement;
