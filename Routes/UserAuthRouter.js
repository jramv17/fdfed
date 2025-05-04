const express = require('express');
const { login } = require("../middlewares/PassportLoginMiddleware");
const UserAuth = require("../Controllers/UserAuth");
require("../config/passport_config");

class UserAuthRouter extends UserAuth {
    constructor() {
        super();
        this.route = express.Router();

        this.route.post('/register', this.register.bind(this));

        this.route.post('/login', login, (req, res) => {
            res.status(200).send({ username: req.userDetails.username, email: req.userDetails.email, uuid: req.userDetails.uuid });
        });
        this.route.get('/logout', this.logout.bind(this));
    }
}

module.exports = new UserAuthRouter().route;
