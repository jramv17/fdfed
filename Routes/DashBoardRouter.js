const express = require('express');
const { jwt_authenticate } = require("../middlewares/PassportLoginMiddleware");
const DashBoardController = require("../Controllers/Dashboard");
require("../config/passport_config");

class DashBoardControllerRouter extends DashBoardController {
    constructor() {
        super();
        this.route = express.Router();
        this.route.use(jwt_authenticate);

        this.route.get('/apartment_details', this.UserApartmentDetails.bind(this));
        this.route.get('/user_apartment_details', this.UserDashDetails.bind(this));
        this.route.get('/apartment-users/:apartment_id', this.ApartmentResidents.bind(this));
    }
}

module.exports = new DashBoardControllerRouter().route;
