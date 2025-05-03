
const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({

    username: String,
    uuid: String,
    email: String,
    password_hash: String,
    userAvatar: { type: String, default: '' },
    isGoogleId: { type: Boolean, default: false },
    googleId: {
        type: String, default: null
    }
}, { timestamps: true });

const User = mongoose.model("User", usersSchema);

module.exports = User;