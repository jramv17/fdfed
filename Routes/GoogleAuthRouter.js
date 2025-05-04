const express = require('express');
const passport = require('passport');
const UserAuth = require("../Controllers/UserAuth");
require("../config/passport_config");

class UserAuthRouter extends UserAuth {
    constructor() {
        super();
        this.route = express.Router();

        this.route.get('/',
            passport.authenticate('google', {
                scope: [
                    'https://www.googleapis.com/auth/userinfo.profile',
                    'https://www.googleapis.com/auth/userinfo.email'
                ]
            })
        );

        this.route.get('/callback',
            passport.authenticate('google', { session: false }),
            this.GoogleCallBack.bind(this)
        );
    }
}

module.exports = new UserAuthRouter().route; 
