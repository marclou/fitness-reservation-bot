const mongoose = require('mongoose');

const gymSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Gym name is required'],
        trim: true,
    },
    address: {
        value: {
            type: String,
            required: [true, 'Gym address is required'],
            trim: true,
        },
        coordinates: {
            longitude: Number,
            latitude: Number,
        }
    },
    maxAttendance: {
        type: Number,
        required: [true, 'Gym capacity is required'],
        min: 1,
        max: 100,
    },
    facilities: {
        shower: {
            type: Boolean,
            default: false,
        },
        dressRoom: {
            type: Boolean,
            default: false,
        },
    },
});

const Gym = mongoose.model('Gym', gymSchema);

module.exports = {
    Gym,
};
