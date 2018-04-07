const mongoose = require('mongoose');
const _ = require('lodash');

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
        default: 60,
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
    attendants: [
        {
            attendantRef: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            hasPaid: {
                type: Boolean,
                default: false,
            },
        },
    ],
    guests: [
        {
            invitedByRef: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            name: {
                type: String,
                trim: true,
            },
        },
    ],
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
}, {
    timestamps: {},
});

function dateValidator(value) {
    return value > Date.now();
}

WorkoutSchema.virtual('url').get(function () {
    return `/dashboard/workout/${this._id}`;
});

WorkoutSchema.methods.toJSON = function () {
    const workout = this;
    const workoutObject = workout.toObject();

    return _.pick(workoutObject, ['_id', 'name', 'location', 'date', 'attendants', 'guests', 'duration', 'cost', 'miscellaneous']);
};


const Workout = mongoose.model('Workout', WorkoutSchema);

module.exports = {
    Workout,
};
