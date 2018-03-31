const mongoose = require('mongoose');
const { ObjectId } = require('mongoose').Types;

const UserSchema = new mongoose.Schema({
    name: {
        first: {
            type: String,
            required: [true, 'First name is required'],
            trim: true,
        },
        last: {
            type: String,
            required: [true, 'Last name is required'],
            trim: true,
        },
    },
    age: {
        type: Number,
        min: 1,
        max: 100,
    },
    locale: {
        type: String,
        required: true,
        enum: ['kr', 'en'],
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
    },
    workouts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Workout',
        },
    ],
    broadcast: {
        type: String,
        required: true,
        enum: ['0', '1', '2'],
        default: '1',
    },
    miscellaneous: {
        session: {},
        timeZone: {},
        isPaymentEnable: {},
        profilePic: {},
    },
}, {
    timestamps: {},
});


const User = mongoose.model('User', UserSchema);

module.exports = {
    User,
};
