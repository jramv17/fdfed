const LogController = require("../Controllers/SecurityController");
const express = require('express');
const { jwt_authenticate } = require("../middlewares/PassportLoginMiddleware");
require("../config/passport_config");

// class LogRouter extends LogController {
//     constructor() {
//         super();
//         this.route = express.Router();
//         this.route.use(jwt_authenticate);

//         this.route.get('/:apartment_id', this.getLogDetails.bind(this));
//         this.route.post('/add-log', this.addLogDetails.bind(this));
//         this.route.post('/add-parcel', this.createParcel.bind(this));
//         this.route.get('/get-parcels/:apartment_id', this.getParcels.bind(this));
//         this.route.post('/add-guest/:apartment_id', this.addGuests.bind(this));
//         this.route.get('/get-guests/:apartment_id', this.getGuests.bind(this));

//     }
// }

// module.exports = new LogRouter().route;


class LogRouter extends LogController {
    constructor() {
        super();
        this.route = express.Router();
        this.route.use(jwt_authenticate);

        /**
         * @swagger
         * tags:
         *   name: Logs
         *   description: Routes for managing resident logs, parcels, and guests
         */

        /**
         * @swagger
         * /log/{apartment_id}:
         *   get:
         *     summary: Get log details for a specific apartment
         *     tags: [Logs]
         *     parameters:
         *       - in: path
         *         name: apartment_id
         *         required: true
         *         schema:
         *           type: string
         *         description: The ID of the apartment
         *     responses:
         *       200:
         *         description: List of logs
         *         content:
         *           application/json:
         *             schema:
         *               type: array
         *               items:
         *                 type: object
         *       500:
         *         description: Server error
         */
        this.route.get('/:apartment_id', this.getLogDetails.bind(this));

        /**
         * @swagger
         * /log/add-log:
         *   post:
         *     summary: Add log details for a resident
         *     tags: [Logs]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required:
         *               - apartment_id
         *               - name
         *               - entry_time
         *               - exit_time
         *             properties:
         *               apartment_id:
         *                 type: string
         *               name:
         *                 type: string
         *               entry_time:
         *                 type: string
         *                 format: date-time
         *               exit_time:
         *                 type: string
         *                 format: date-time
         *     responses:
         *       201:
         *         description: Log added successfully
         *       500:
         *         description: Server error
         */
        this.route.post('/add-log', this.addLogDetails.bind(this));

        /**
         * @swagger
         * /log/add-parcel:
         *   post:
         *     summary: Add a parcel record for a resident
         *     tags: [Logs]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required:
         *               - apartment_id
         *               - residentName
         *               - parcelReachedTime
         *               - parcelType
         *               - senderAddress
         *             properties:
         *               apartment_id:
         *                 type: string
         *               residentName:
         *                 type: string
         *               parcelReachedTime:
         *                 type: string
         *                 format: date-time
         *               parcelType:
         *                 type: string
         *               senderAddress:
         *                 type: string
         *     responses:
         *       201:
         *         description: Parcel created successfully
         *       500:
         *         description: Server error
         */
        this.route.post('/add-parcel', this.createParcel.bind(this));

        /**
         * @swagger
         * /log/get-parcels/{apartment_id}:
         *   get:
         *     summary: Get all parcels for a specific apartment
         *     tags: [Logs]
         *     parameters:
         *       - in: path
         *         name: apartment_id
         *         required: true
         *         schema:
         *           type: string
         *         description: The ID of the apartment
         *     responses:
         *       200:
         *         description: List of parcels
         *         content:
         *           application/json:
         *             schema:
         *               type: array
         *               items:
         *                 type: object
         *       500:
         *         description: Server error
         */
        this.route.get('/get-parcels/:apartment_id', this.getParcels.bind(this));

        /**
         * @swagger
         * /log/add-guest/{apartment_id}:
         *   post:
         *     summary: Add guest entries for a specific apartment
         *     tags: [Logs]
         *     parameters:
         *       - in: path
         *         name: apartment_id
         *         required: true
         *         schema:
         *           type: string
         *         description: The ID of the apartment
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required:
         *               - flat_no
         *               - no_of_guests
         *               - guest_names
         *             properties:
         *               flat_no:
         *                 type: string
         *               no_of_guests:
         *                 type: integer
         *               guest_names:
         *                 type: array
         *                 items:
         *                   type: string
         *     responses:
         *       201:
         *         description: Guests added successfully
         *       400:
         *         description: Invalid data provided
         *       500:
         *         description: Server error
         */
        this.route.post('/add-guest/:apartment_id', this.addGuests.bind(this));

        /**
         * @swagger
         * /log/get-guests/{apartment_id}:
         *   get:
         *     summary: Get all guests for a specific apartment
         *     tags: [Logs]
         *     parameters:
         *       - in: path
         *         name: apartment_id
         *         required: true
         *         schema:
         *           type: string
         *         description: The ID of the apartment
         *     responses:
         *       200:
         *         description: List of guests
         *         content:
         *           application/json:
         *             schema:
         *               type: array
         *               items:
         *                 type: object
         *       500:
         *         description: Server error
         */
        this.route.get('/get-guests/:apartment_id', this.getGuests.bind(this));
    }
}

module.exports = new LogRouter().route;

