const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            index: true,
        },
        uuid: String,
        email: {
            type: String,
            index: true,
        },
        password_hash: String,
        userAvatar: { type: String, default: "" },
        isGoogleId: { type: Boolean, default: false },
        googleId: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            versionKey: false,
            transform: (_, ret) => {
                delete ret.password_hash;
                return ret;
            },
        },
    },
);

const User = mongoose.model("User", usersSchema);

module.exports = User;
