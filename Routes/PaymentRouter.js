const express = require('express');
const PaymentController = require("../Controllers/PaymentController");
const { jwt_authenticate } = require("../middlewares/PassportLoginMiddleware");



/**
 * @swagger
 * tags:
 *   name: Payment
 *   description: Endpoints for managing apartment subscription payments
 */

/**
 * @swagger
 * /api/payment/create-subscription:
 *   post:
 *     summary: Create a new subscription for an apartment
 *     tags: [Payment]
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
 *               plan_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Subscription created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/payment/update-subscription:
 *   put:
 *     summary: Update an existing subscription
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subscription_id:
 *                 type: string
 *               new_plan_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Subscription updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/payment/cancel-subscription/{apartment_id}/{subscription_id}:
 *   delete:
 *     summary: Cancel an active subscription
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: apartment_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the apartment
 *       - in: path
 *         name: subscription_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the subscription
 *     responses:
 *       200:
 *         description: Subscription canceled successfully
 *       400:
 *         description: Invalid parameters
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/payment/get-subscription-details/{apartment_id}:
 *   get:
 *     summary: Retrieve subscription details for a specific apartment
 *     tags: [Payment]
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
 *         description: Subscription details retrieved successfully
 *       404:
 *         description: Subscription not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */





class PaymentRouter extends PaymentController {
    constructor() {
        super();
        this.route = express.Router();
        this.route.use(jwt_authenticate);
        this.route.post('/create-subscription', this.createSubscription.bind(this));
        this.route.put('/update-subscription', this.updateSubscription.bind(this));
        this.route.delete('/cancel-subscription/:apartment_id/:subscription_id', this.deleteSubscription.bind(this));
        this.route.get('/get-subscription-details/:apartment_id', this.getSubscriptionDetails.bind(this));

    }
}

module.exports = new PaymentRouter().route;