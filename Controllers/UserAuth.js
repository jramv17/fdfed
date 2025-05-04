const User = require("../Models/UserModel");
const { generateHash } = require("../utils/passwordUtils");
const { issueJWT } = require("../utils/jwtUtils");
const { v4: uuidv4 } = require('uuid');
const CLIENT_URL = "http://localhost:5173/";
const FALLBACK_URL = "http://localhost:5173/sign-in";
require("../config/passport_config");
const ApartmentData = require("../Models/UserApartmentModel");

class UserAuthentication {
    constructor() {
        this.user = null;
    }

    async register(req, res) {
        const { username, email, password } = req.body;
        try {
            this.user = await User.findOne({
                $or: [{ username: username }, { email: email }]
            });

            if (this.user) {
                return res.status(400).send({ message: "Username or email already in use" });
            }

            const { hash } = generateHash(password);
            const uuid = uuidv4();


            const newUser = new User({
                username,
                email,
                uuid,

                password_hash: hash
            });

            await newUser.save();
            this.user = newUser;
            const ApartmentModel = new ApartmentData({
                user: this.user._id
            })
            await ApartmentModel.save();
            const { token } = issueJWT(this.user);

            res.cookie('jwt', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 1000 * 60 * 60 * 24
            });
            res.status(200).send({ username: this.user.username, email: this.user.email, uuid: this.user.uuid });
        } catch (error) {
            res.status(500).send({ message: "Server error. Please try again later." });
        }
    } async logout(req, res) {

        res.clearCookie('jwt');
        return res.status(200).json({ message: 'Successfully logged out' });



    }
    async GoogleCallBack(req, res) {
        try {
            if (req.user) {
                const { token } = issueJWT(req.user);
                res.clearCookie('jwt');
                res.cookie('jwt', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 1000 * 60 * 60 * 24
                });
                res.redirect(CLIENT_URL);
            } else {
                res.redirect(FALLBACK_URL);
            }
        } catch (error) {
            res.status(500).send({ message: "Authentication failed." });
        }
    }
}

module.exports = UserAuthentication;
