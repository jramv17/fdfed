const mongoose = require('mongoose');

const parcelSchema = new mongoose.Schema({
    apartment_id: String,
    residentName: String,
    parcelReachedTime: String,
    parcelType: String,
    senderAddress: String,
    status: { type: String, default: 'Not Yet Taken' },
});

const Parcel = mongoose.model('Parcel', parcelSchema);

module.exports = Parcel;