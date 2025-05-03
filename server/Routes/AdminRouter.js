const express = require('express');
const { jwt_authenticate } = require("../middlewares/PassportLoginMiddleware");
const AdminController = require("../Controllers/AdminController");
const { admin_verify } = require("../middlewares/AdminMiddleware");
require("../config/passport_config");

class AdminRouter extends AdminController {
    constructor() {
        super();
        this.route = express.Router();

        this.route.get('/details', jwt_authenticate, admin_verify, this.Adminfetch.bind(this));

    }
}

module.exports = new AdminRouter().route;
