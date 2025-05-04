const RazorpayPayment = require('../utils/razorpayutils')
const RoomModel = require("../Models/RoomModel")
const plans = require('../constants/razorpayconstants');
class PaymentController extends RazorpayPayment {
    constructor() {
        super();
    }

    async createSubscription(req, res) {
        try {
            const subscription = await this.createRazorpaySubscription(req.body);
            res.status(200).json({ subscription });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to create subscription' });
        }
    }

    async updateSubscription(req, res) {
        const { apartment_id } = req.body;
        const room = await RoomModel.findOne({ apartment_id });
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        if (room.subscriptionStatus != 'active') {
            return res.status(400).json({ message: 'Subscription is not active' });
        }
        if (room.owner != req.id) {
            return res.status(403).json({ message: 'Unauthorized access' });
        }
        try {
            const options = {
                plan_id: req.body.plan_id,
            }
            await this.updateRazorPaySubscription(req.body.subscription_id, options);
            room.subscription = options.plan_id === plans.basic.plan_id ? 'Basic' : 'Premium';
            await room.save();
            res.status(200).json({ message: 'Subscription updated successfully' });

        } catch (error) {

            console.error(error);
            res.status(500).json({ error: 'Failed to update subscription' });

        }
    }
    async getSubscriptionDetails(req, res) {
        try {
            console.log(req.params);
            const { apartment_id } = req.params;
            const room = await RoomModel.findOne({ apartment_id });
            if (!room) {
                return res.status(404).json({ message: 'Room not found' });
            }
            if (room.owner != req.id) {
                return res.status(403).json({ message: 'Unauthorized access' });
            }
            const subscription = await this.getRazorpaySubscriptionDetails(room.subscriptionId);
            res.status(200).json({ subscription: subscription });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to get subscription details' });

        }
    }
    async deleteSubscription(req, res) {
        try {
            console.log(req.params);
            const { apartment_id, subscription_id } = req.params;
            const room = await RoomModel.findOne({ apartment_id });

            if (!room) {
                return res.status(404).json({ message: 'Room not found' });
            }
            if (room.owner != req.id) {
                return res.status(403).json({ message: 'Unauthorized access' });
            }

            await this.cancelRazorpaySubscription(subscription_id);
            room.subscriptionStatus = 'cancelled';
            await room.save();
            res.status(200).json({ message: 'Subscription cancelled successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to cancel subscription' });

        }
    }


}

module.exports = PaymentController;