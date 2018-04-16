const mongoose = require('mongoose');

const GymSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Gym name is required'],
        trim: true,
        unique: true,
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
        },
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
}, {
    timestamps: {},
});

GymSchema.virtual('url').get(function () {
    return `/dashboard/gym/${this._id}`;
});

GymSchema.statics.findByName = function (name) {
	const Gym = this;

	return Gym.findOne({ name }).then((gym) => {
		if (!gym) {
			return Promise.reject(new Error('Gym name doesn\'t match existing gyms'));
		}
		return Promise.resolve(gym);
	});
};

const Gym = mongoose.model('Gym', GymSchema);

module.exports = {
    Gym,
};
