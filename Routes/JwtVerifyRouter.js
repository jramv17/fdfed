const express = require('express');
const { jwt_authenticate } = require("../middlewares/PassportLoginMiddleware");
const checkJwt = require("../Controllers/jwtVerify");
require("../config/passport_config");

class JwtVerifyRouter extends checkJwt {
    constructor() {
        super();
        this.route = express.Router();
        this.route.use(jwt_authenticate);

        this.route.get('/', this.getRequest.bind(this));


    }
}

module.exports = new JwtVerifyRouter().route;
