const passport = require('passport');
const { issueJWT } = require("../utils/jwtUtils");
require("dotenv").config();
const LOGIN_URL = "http://localhost:5173/sign-in";
const login = async (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) {
            console.log("error", err);
            return res.status(400).json({ message: info });
        }
        if (!user) {
            return res.status(400).json({ message: info });
        } if (user) {
            if (user.isGoogleId) {
                return res.status(403).json({ message: 'You are already logged in using Google.' });
            }
            const { token } = issueJWT(user);
            res.cookie('jwt', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 1000 * 60 * 60 * 24
            });
            req.userDetails = user;
            next();
        }
    })(req, res, next);
}

const jwt_authenticate = async (req, res, next) => {
    passport.authenticate('jwt', (error, user, info) => {

        if (error) {
            return res.status(500).json({ message: info.message });
        };
        if (!user) {
            return res.status(400).json({ message: "Invalid token" });
        };
        req.id = user._id;
        req.userDetails = {
            avatar: user.userAvatar,
            username: user.username,
            email: user.email,
            uuid: user.uuid,
            id: user._id
        }
        if (user.email === 'adminsl@gmail.com') {
            req.isAdmin = true;
        } else {
            req.isAdmin = false;
        }
        next();
    })(req, res, next);
}

module.exports = { login, jwt_authenticate };