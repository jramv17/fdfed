const express = require('express');
const { jwt_authenticate } = require("../middlewares/PassportLoginMiddleware");
require("../config/passport_config");
const RoomDetails = require("../Controllers/RoomDetailsController");


/**
 * @swagger
 * tags:
 *   name: RoomDetails
 *   description: Endpoints for managing room details, users, complaints, roles, and events
 */

/**
 * @swagger
 * /api/roomdetails/{apartment_id}:
 *   get:
 *     summary: Fetch basic apartment details
 *     tags: [RoomDetails]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: apartment_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the apartment
 *     responses:
 *       200:
 *         description: Apartment details retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 room:
 *                   type: object
 *                   description: Room details
 *                   properties:
 *                     apartment_id:
 *                       type: string
 *                     apartment_name:
 *                       type: string
 *                     ownername:
 *                       type: string
 *                     start_date:
 *                       type: string
 *                     number_of_residents:
 *                       type: integer
 *                 details:
 *                   type: object
 *                   properties:
 *                     apartment_id:
 *                       type: string
 *                     apartment_name:
 *                       type: string
 *                     ownername:
 *                       type: string
 *                     start_date:
 *                       type: string
 *                     number_of_residents:
 *                       type: integer
 *                     user_id:
 *                       type: string
 *                     role:
 *                       type: string
 *                     isAuthority:
 *                       type: boolean
 *                     username:
 *                       type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Apartment not found
 */

/**
 * @swagger
 * /api/roomdetails/{apartment_id}/details:
 *   get:
 *     summary: Get detailed information about rooms in an apartment
 *     tags: [RoomDetails]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: apartment_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the apartment
 *     responses:
 *       200:
 *         description: Room details retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 roomdetails:
 *                   type: object
 *                   description: Room details object
 *                 apartment_users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       user_id:
 *                         type: string
 *                       username:
 *                         type: string
 *                       apartment_name:
 *                         type: string
 *                       role:
 *                         type: string
 *                       email:
 *                         type: string
 *                       isAuthority:
 *                         type: boolean
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Apartment or rooms not found
 */

/**
 * @swagger
 * /api/roomdetails/deleteuser:
 *   post:
 *     summary: Delete a user from the apartment
 *     tags: [RoomDetails]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *               apartment_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/roomdetails/raise-ticket:
 *   post:
 *     summary: File a complaint by apartment owner
 *     tags: [RoomDetails]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               complaint:
 *                 type: string
 *               severity:
 *                 type: string
 *               apartment_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Complaint filed successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/roomdetails/role-assign:
 *   put:
 *     summary: Assign or change a user's role
 *     tags: [RoomDetails]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *               new_role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/roomdetails/schedule-event:
 *   post:
 *     summary: Schedule an event for the apartment
 *     tags: [RoomDetails]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               apartment_id:
 *                 type: string
 *               event:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Event scheduled successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */





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
