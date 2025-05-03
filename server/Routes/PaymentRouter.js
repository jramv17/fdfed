const express = require('express');
const PaymentController = require("../Controllers/PaymentController");
const { jwt_authenticate } = require("../middlewares/PassportLoginMiddleware");

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