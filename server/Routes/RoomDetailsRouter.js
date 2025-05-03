const express = require('express');
const { jwt_authenticate } = require("../middlewares/PassportLoginMiddleware");
require("../config/passport_config");
const RoomDetails = require("../Controllers/RoomDetailsController");
class RoomDetailsRouter extends RoomDetails {
    constructor() {
        super();
        this.route = express.Router();
        this.route.use(jwt_authenticate);

        this.route.get('/:apartment_id', this.fetchDetails.bind(this));
        this.route.get('/:apartment_id/details', this.RoomDetails.bind(this));
        this.route.post('/deleteuser', this.DeleteUsers.bind(this));
        this.route.post('/raise-ticket', this.ComplaintFilebyOwner.bind(this));
        this.route.put('/role-assign', this.RoleModification.bind(this));
        this.route.post('/schedule-event', this.ScheduleEvent.bind(this));


    }
}

module.exports = new RoomDetailsRouter().route;
