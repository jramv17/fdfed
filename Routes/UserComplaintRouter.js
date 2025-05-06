const express = require('express');
const { jwt_authenticate } = require("../middlewares/PassportLoginMiddleware");
const { createComplaint, getApartmentDetails, updateIsSolved } = require('../Controllers/complaintController');

require("../config/passport_config");



/**
 * @swagger
 * tags:
 *   name: Complaints
 *   description: API for managing apartment complaints
 */

/**
 * @swagger
 * /api/complaints:
 *   post:
 *     summary: Create a new complaint
 *     tags: [Complaints]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - complaintTitle
 *               - complaintType
 *               - complaintDetail
 *               - anonymous
 *               - apartment_id
 *             properties:
 *               complaintTitle:
 *                 type: string
 *                 example: "Leaking pipe in bathroom"
 *               complaintType:
 *                 type: string
 *                 enum: ["Apartment Issue", "Resident Issue", "Other"]
 *                 example: "Apartment Issue"
 *               complaintDetail:
 *                 type: string
 *                 example: "There is a constant water leak in the shared bathroom."
 *               anonymous:
 *                 type: boolean
 *                 example: false
 *               apartment_id:
 *                 type: string
 *                 example: "APT123"
 *     responses:
 *       200:
 *         description: Complaint created successfully
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/complaints/{apartment_id}:
 *   get:
 *     summary: Get all complaints for an apartment (only accessible by apartment owner)
 *     tags: [Complaints]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: apartment_id
 *         required: true
 *         schema:
 *           type: string
 *           example: "APT123"
 *         description: The ID of the apartment
 *     responses:
 *       200:
 *         description: List of complaints
 *       403:
 *         description: Unauthorized access
 *       404:
 *         description: Room not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/complaints/update-is-solved/{id}:
 *   put:
 *     summary: Update complaint solved status
 *     tags: [Complaints]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "6658a23bf97cc3b0f8a8b54d"
 *         description: The ID of the complaint to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isSolved
 *             properties:
 *               isSolved:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Complaint status updated successfully
 *       404:
 *         description: Complaint not found
 *       500:
 *         description: Server error
 */


class CreateRoomComplaint {
    constructor() {

        this.route = express.Router();
        this.route.use(jwt_authenticate);
        this.route.post('/', jwt_authenticate, createComplaint);
        this.route.get('/:apartment_id', getApartmentDetails);
        this.route.put('/update-is-solved/:id', updateIsSolved);





    }
}


module.exports = new CreateRoomComplaint().route;


