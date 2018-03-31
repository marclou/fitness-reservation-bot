const { ObjectID } = require('mongodb');

const { Gym, Workout, User } = require('./../models/index');

const users = [
    {
        _id: new ObjectID(),
        name: {
            first: 'Marc',
            last: 'Lou',
        },
        age: 24,
        locale: 'en',
        gender: 'male',
        email: 'marc.louvion@gmail.com',
    }, {
        _id: new ObjectID(),
        name: {
            first: 'Jihyeon',
            last: 'Won',
        },
        age: 25,
        locale: 'kr',
        gender: 'female',
        email: 'jwjp@gmail.com',
    },
];

const gyms = [
    {
        _id: new ObjectID(),
        name: 'WonjiFit',
        address: {
            value: '123 rue des moches',
        },
        maxAttendance: 5,
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
        guests: [
            {
                invitedBy: users[0],
                name: 'First Guest',
            },
        ],
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

const populateUsers = async () => {
    await User.remove({});
    await User.insertMany(users);
};

const populateGyms = async () => {
    await Gym.remove({});
    await Gym.insertMany(gyms);
};

const populateWorkouts = async () => {
    await Workout.remove({});
    await Workout.insertMany(workouts);
};

module.exports = {
    users,
    gyms,
    workouts,
    populateUsers,
    populateGyms,
    populateWorkouts,
};
