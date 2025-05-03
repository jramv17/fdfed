const Complaint = require('../Models/UserComplaintModel');
const ApartmentUser = require("../Models/ApartmentUserModel");
const Room = require("../Models/RoomModel");
const createComplaint = async (req, res) => {
  const { complaintTitle, complaintType, complaintDetail, anonymous, apartment_id } = req.body;
  const userId = req.id;

  try {
    let UserDetails;
    if (!anonymous) {
      UserDetails = await ApartmentUser.findOne({ user: req.id, apartment_id: apartment_id });
    }
    const complaint_details = {
      complaintTitle: complaintTitle,
      complaintType: complaintType,
      complaintDetail: complaintDetail,
      anonymous: anonymous,
      userId: req.id,
      username: anonymous ? 'Anonymous' : UserDetails.username,
      apartment_id: apartment_id,
      flat_id: anonymous ? '000' : UserDetails.flat_id
    }
    const complaint = new Complaint(complaint_details);
    await complaint.save();
    return res.status(200).send(complaint);


  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server Error" })
  }

};


const getApartmentDetails = async (req, res) => {
  try {

    const { apartment_id } = req.params;
    const room = await Room.findOne({ apartment_id: apartment_id });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    if (room.owner != req.id) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    const Complaints = await Complaint.find({ apartment_id });
    return res.status(200).json(Complaints);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
}


const updateIsSolved = async (req, res) => {
  const { id } = req.params;
  const { isSolved } = req.body;

  try {
    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.isSolved = isSolved;
    await complaint.save();

    return res.status(200).json({ message: 'Complaint status updated successfully', complaint });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = { getApartmentDetails, createComplaint, updateIsSolved };