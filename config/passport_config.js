const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../Models/UserModel");
const { verifyPassword } = require("../utils/passwordUtils.js");
var JwtStrategy = require('passport-jwt').Strategy;
const CookieParser = require('cookie-parser');
passport.use(CookieParser());
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const { v4: uuidv4 } = require('uuid');
const ApartmentData = require("../Models/UserApartmentModel");
const { generateHash } = require("../utils/passwordUtils");
const env_variables = require("../utils/envutils.js");
const { getDecryptedToken } = require("../utils/jwtUtils.js");
var cookieExtractor = function (req) {
    var encryptedtoken = null;
    if (req && req.cookies && req.cookies['jwt']) {

        encryptedtoken = req.cookies['jwt'].token || req.cookies['jwt'];
    }
    const token = encryptedtoken ? getDecryptedToken(encryptedtoken) : null;
    return token;
};

var opts = { secretOrKey: env_variables.JWT_SECRET_KEY };
opts.jwtFromRequest = cookieExtractor;
const customFields = {
    usernameField: 'identifier',
    passwordField: 'password',
};

const VerifyUser = (username, password, done) => {
    if (!username || !password) {
        return done(null, false, { message: 'Username and password are required.' });
    }
    User.findOne({
        $or: [{ username: username }, { email: username }]
    }).then((user) => {
        if (!user) {
            return done(null, false, { message: 'Incorrect username or email.' });
        }

        const isValid = verifyPassword(password, user.password_hash);
        if (!isValid) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
    }).catch(err => {
        done(err, false, { message: err.message })
    });
}
passport.use(new JwtStrategy(opts, async (token, done) => {
    if (!token) {
        return done(null, false, { message: "Token is not present" });
    }
    return done(null, token.sub);
}));
const strategy = new LocalStrategy(customFields, VerifyUser);
passport.use(new GoogleStrategy({
    clientID: env_variables.GOOGLE_CLIENT_ID,
    clientSecret: env_variables.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback",
    passReqToCallback: true

},
    async function (request, accessToken, refreshToken, profile, cb) {
        const email = profile._json.email;
        const user = await User.findOne({ email: email });
        const username = profile.displayName;
        if (user) {
            if (user.isGoogleId) {
                return cb(null, user);
            } else {
                return cb("Already manually logged in", false);
            }
        } else {
            const uuid = uuidv4();
            const hash = generateHash(profile.id);
            const newUser = new User({
                username: username,
                email: email,
                uuid: uuid,
                userAvatar: profile._json.picture,
                password_hash: hash,
                isGoogleId: true,
                googleId: profile.id
            });
            await newUser.save();
            const ApartmentModel = new ApartmentData({
                user: newUser._id
            })
            await ApartmentModel.save();
            return cb(null, newUser);
        }
    }
));
passport.use(strategy);
