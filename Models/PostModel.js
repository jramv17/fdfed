const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    fileUrl: {
        type: String,
        required: true,
    },
    likes: {
        type: Number,
        default: 0,
    },
    likedIPs: {
        type: [String], // Array of IPs to track unique likes
        default: [],
    },
    apartment_id: {
        type: String,
        required: true,
    },
    comments: {
        type: [CommentSchema], // Embedded subdocument for comments
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Post', PostSchema);
