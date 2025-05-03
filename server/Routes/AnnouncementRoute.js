const { jwt_authenticate } = require("../middlewares/PassportLoginMiddleware");
const Annnouncement = require("../Models/ApartmentAnnouncementsModel");
const express = require('express');
const multer = require('multer');
const route = express.Router();
const path = require('path');
const fs = require('fs');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const path_of_file = path.join(__dirname, "../uploads");
        cb(null, path_of_file);
    },
    filename: function (req, file, cb) {

        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage })

const createAnnouncement = async (req, res) => {
    try {
        const { apartment_username, apartment_id, user_designation, announcement_msg, file } = req.body;
        const fileUrl = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : null;
        if (!announcement_msg) {
            return res.status(400).json({ error: 'announcement_msg is required' });
        }
        const announcement = new Annnouncement({
            apartment_username,
            apartment_id,
            user_designation,
            announcement_msg,
            fileUrl: req.file ? `http://localhost:5000/uploads/${req.file.filename}` : null,
            filename: req.file ? req.file.filename : null,
        });
        await announcement.save();
        return res.status(201).json({ message: "Announcement Made", announcement });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};




const getAnnouncements = async (req, res) => {
    try {
        const { apartment_id } = req.params;
        const announcements = await Annnouncement.find({ apartment_id }).sort({ timestamp: -1 });
        res.status(200).json(announcements);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};
route.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../uploads', filename);
    if (fs.existsSync(filePath)) {
        res.download(filePath, filename, (err) => {
            if (err) {
                console.error('Error downloading file:', err);
                res.status(500).send('Error downloading file');
            }
        });
    } else {
        res.status(404).send('File not found');
    }
});


route.get('/:apartment_id', getAnnouncements);
route.post('/create', jwt_authenticate, upload.single('file'), createAnnouncement);
module.exports = route;