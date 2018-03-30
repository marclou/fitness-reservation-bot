const { ObjectID } = require('mongodb');

const { app } = require('./../app');
const { Gym, Workout } = require('./../models/index');

const gyms = [
    {
        _id: new ObjectID(),
        name: 'WonjiFit',
        address: {
            value: '123 rue des moches',
        },
        maxAttendance: 50,
	}, {
        _id: new ObjectID(),
        name: 'MarcFit',
        address: {
            value: '98 th steeet',
        },
        maxAttendance: 10,
    },
];

const workouts = [
    {
        _id: new ObjectID(),
        name: 'First Workout',
		location: gyms[0]._id,
		cost: {
			individual: 10000,
			group: 5000,
		},
		miscellaneous: {
			en: 'Description',
			kr: 'Hangul',
		},
		date: Date.now() + 10000000,
    }, {
        _id: new ObjectID(),
        name: 'Second Workout',
		location: gyms[1]._id,
		cost: {
			individual: 15000,
			group: 9000,
		},
		miscellaneous: {
			en: 'Description again',
			kr: 'Hangul again',
		},
		date: Date.now() + 20000000,
    },
];

const populateGyms = async () => {
    await Gym.remove({});
    await Gym.insertMany(gyms);
};

const populateWorkouts = async () => {
    await Workout.remove({});
    await Workout.insertMany(workouts);
};

module.exports = {
    gyms,
    workouts,
    populateGyms,
    populateWorkouts
};
