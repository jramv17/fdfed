const mongoose = require("mongoose");

const UserApartmentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            type: true,
            required: true,
        },
        apartments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Apartment",
                default: [],
            },
        ],
    },
    { timestamps: true },
);

const UserApartment = mongoose.model("UserApartment", UserApartmentSchema);

module.exports = UserApartment;
