const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  complaintTitle: { type: String, required: true },
  complaintType: { type: String, enum: ['Apartment Issue', 'Resident Issue', 'Other'], required: true },
  complaintDetail: { type: String, required: true },
  anonymous: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true }, // New field
  apartment_id: { type: String, required: true }, // New field
  flat_id: { type: String, required: true }, // New field
  isSolved: { type: Boolean, default: false }
}, { timestamps: true });


const Complaint = mongoose.model('Complaint', ComplaintSchema);

module.exports = Complaint;
