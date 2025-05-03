const express = require('express');
const { jwt_authenticate } = require("../middlewares/PassportLoginMiddleware");
const CreateRoom = require("../Controllers/CreateRoom");
require("../config/passport_config");

class CreateRoomRouter extends CreateRoom {
    constructor() {
        super();
        this.route = express.Router();
        this.route.use(jwt_authenticate);
        this.route.post('/verify-registration-num', this.registrationNumberCheck.bind(this));
        this.route.post('/', this.createRoomReq.bind(this));
        this.route.put('/edit-email', this.editemail.bind(this));

    }
}

module.exports = new CreateRoomRouter().route;
