const mongoose = require('mongoose');
const { ObjectId } = require('mongoose').Types;

const WorkoutSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Workout name is required'],
        trim: true,
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gym',
        required: [true, 'Workout should include a location'],
    },
    duration: {
        type: Number,
        default: () => 60,
        min: 10,
        max: 240,
    },
    cost: {
        individual: {
            type: Number,
            required: [true, 'Cost per attendant is required'],
            min: 5000,
            max: 50000,
        },
        group: {
            type: Number,
            min: 5000,
            max: 50000,
        },
    },
    attendants: {
        type: Number,
    },
    date: {
        type: Date,
        required: [true, 'Workout date is required'],
        unique: [true, 'Another workout is overlaid by this one'],
        validate: [dateValidator, 'Date must be greater than current date'],
    },
    miscellaneous: {
        en: {
            type: String,
            trim: true,
        },
        kr: {
            type: String,
            trim: true,
        },
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

function dateValidator(value) {
    return this.createdAt < value;
}

const Workout = mongoose.model('Workout', WorkoutSchema);

module.exports = {
    Workout,
};
