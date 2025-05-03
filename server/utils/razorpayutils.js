const Razorpay = require('razorpay')
const env_variables = require("../utils/envutils")
const plans = require("../constants/razorpayconstants")
const { validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils');
class RazorpayPayment {
    razorpay_instance = null;
    constructor() {
        this.razorpay_instance = new Razorpay({
            key_id: env_variables.RAZORPAY_KEY_ID,
            key_secret: env_variables.RAZORPAY_SECRET_KEY,
            currency: 'INR',

        })
    }
    async createRazorpaySubscription(subdetails) {
        try {


            const plan_id = subdetails.sub_type === 'Basic' ? plans.basic.plan_id : plans.premium.plan_id;

            return this.razorpay_instance.subscriptions.create({
                plan_id: plan_id,
                customer_notify: 1,
                quantity: 1,
                total_count: 5,
                notes: {
                    key1: "value3",
                    key2: "value2"
                }
            });
        } catch (error) {
            console.error(error);
            throw new Error('Failed to create subscription: ' + error.message);
        }
    }

    async getRazorpaySubscriptionDetails(subscriptionId) {
        try {
            return this.razorpay_instance.subscriptions.fetch(subscriptionId);
        } catch (error) {
            console.error(error);
            throw new Error('Failed to get subscription details: ');

        }
    }



    async cancelRazorpaySubscription(subscriptionId) {
        try {
            const response = await this.razorpay_instance.subscriptions.cancel(subscriptionId);
            return response;

        } catch (error) {
            console.error(error);
            throw new Error('Failed to cancel subscription: ');

        }




    }
    async updateRazorPaySubscription(subscriptionId, options) {
        try {
            return this.razorpay_instance.subscriptions.update(subscriptionId, options);
        } catch (error) {
            console.error(error);
            throw new Error('Failed to update subscription: ');

        }
    }
}

module.exports = RazorpayPayment;