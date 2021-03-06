const mongoose = require('mongoose');
const validator = require('validator');

const { Workout } = require('./index');

const UserSchema = new mongoose.Schema({
    name: {
        first: {
            type: String,
            required: [true, 'First name is required'],
            trim: true,
            minLength: 3,
        },
        last: {
            type: String,
            required: [true, 'Last name is required'],
            trim: true,
            minLength: 1,
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
            workoutRef: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Workout',
                required: true,
            },
            hasPaid: {
                type: Boolean,
                default: false,
            },
        },
    ],
    broadcast: {
        type: String,
        required: true,
        enum: ['0', '1', '2'],
        default: '1',
    },
    email: {
        type: String,
        validate: [emailValidator, 'Should be a valid e-mail'],
    },
    phone: {
        type: String,
        validate: [phoneValidator, 'Should be a valid phone number'],
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

function phoneValidator(value) {
    return validator.isMobilePhone(value, 'en-US', 'ko-KR');
}

function emailValidator(value) {
    return validator.isEmail(value);
}

UserSchema.virtual('full_name').get(function () {
    return `${this.name.first} ${this.name.last}`;
});

UserSchema.methods.subscribeWorkout = function (workoutID, userGuests = []) {
    const user = this;

    return Workout.findById(workoutID).populate('location')
        .then((workout) => {
            const { attendants, guests, location } = workout;
            const totalAttendants = attendants.length + guests.length;

            if (totalAttendants + userGuests.length < location.maxAttendance) {
                let guestsToInsert = [];

                if (userGuests.length > 0) {
                    guestsToInsert = userGuests.map((guest) => {
                        return {
                            invitedByRef: user._id,
                            name: guest,
                        };
                    });
                }

                return user.update(
                        {
                            $push: {
                                workouts: {
                                    workoutRef: workoutID,
                                },
                            },
                        },
                        { new: true },
                    )
                    .then(() => workout.update(
                        {
                            $push: {
                                attendants: {
                                    attendantRef: user._id,
                                },
                                guests: {
                                    $each: guestsToInsert,
                                },
                            },
                        },
                        { new: true },
                    ));
            }
            return Promise.reject(new Error('The workout gym is already full'));
        });
};

const User = mongoose.model('User', UserSchema);

module.exports = {
    User,
};
