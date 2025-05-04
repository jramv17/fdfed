const mongoose = require('mongoose');

const ApartmentComplaintSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    complaint: {
        type: String,
        required: true
    },
    severity: {
        type: String,
        required: true
    },
    apartment_id: {
        type: String,
        required: true
    }

}, { timestamps: true });

const ApartmentComplaint = mongoose.model('ApartmentComplaints', ApartmentComplaintSchema);

module.exports = ApartmentComplaint;