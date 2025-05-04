const mongoose = require('mongoose');

const CalendarEventSchema = new mongoose.Schema({
    apartment_id: String,
    events: [{
        event: {
            type: String,
            required: true
        },
        date: {
            type: String,
            required: true
        }
    }],
}, { timestamps: true });

const CalendarEvent = mongoose.model('CalendarEvent', CalendarEventSchema);

module.exports = CalendarEvent;
