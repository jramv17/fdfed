const mongoose = require('mongoose');

const ResidentLogSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    resident_id: {
        type: String,
        required: true
    },
    entry_time: {
        type: Date,
        required: true
    },
    exit_time: {
        type: Date,
        required: true
    }
}, { timestamps: true });  // Automatically adds createdAt and updatedAt timestamps

const ResidentLog = mongoose.model('ResidentLog', ResidentLogSchema);

module.exports = ResidentLog;
