const express = require('express');
const { jwt_authenticate } = require("../middlewares/PassportLoginMiddleware");
const CreateRoom = require("../Controllers/CreateRoom");
require("../config/passport_config");

/**
 * @swagger
 * tags:
 *   name: Room
 *   description: API for creating and managing rooms
 */

/**
 * @swagger
 * /api/room/verify-registration-num:
 *   post:
 *     summary: Verify registration number before room creation
 *     tags: [Room]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               registrationNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Registration number verified
 *       400:
 *         description: Invalid registration number
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/room:
 *   post:
 *     summary: Create a new room
 *     tags: [Room]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roomName:
 *                 type: string
 *               address:
 *                 type: string
 *               pincode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Room created successfully
 *       400:
 *         description: Validation failed
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/room/edit-email:
 *   put:
 *     summary: Edit registered email for the room
 *     tags: [Room]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newEmail:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email updated successfully
 *       400:
 *         description: Invalid email
 *       500:
 *         description: Server error
 */





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
