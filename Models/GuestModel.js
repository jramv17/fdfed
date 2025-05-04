const mongoose = require('mongoose');

const GuestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    flat_no: {
        type: String,
        required: true,
    },
    apartment_id: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const Guest = mongoose.model('Guest', GuestSchema);
module.exports = Guest;
