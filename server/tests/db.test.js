const expect = require('expect');
const server = require('./../')();
const config = require('./../../config');

const {
	User,
	Gym,
	Workout,
} = require('./../models');
const {
	users,
	gyms,
	workouts,
	populateUsers,
	populateGyms,
	populateWorkouts,
} = require('./seeds.js');

server.create(config);
server.start();

beforeEach(populateUsers);
beforeEach(populateGyms);
beforeEach(populateWorkouts);

describe('SAVE', () => {
	it('# Workout by name (not ObjectID)', (done) => {
		const {
			name,
			_id,
		} = gyms[0];

		Gym
			.findByName(name)
			.then((gym) => {
				const workout = new Workout({
					name: 'First Workout',
					location: gym._id,
					cost: {
						individual: 12000,
						group: 7000,
					},
					miscellaneous: {
						en: 'Description',
						kr: 'Hangul',
					},
					date: Date.now() + 1000000,
				});

				return workout.save().then((res) => {
					expect(res.location.toHexString()).toBe(_id.toHexString());
					done();
				});
			})
			.catch(error => done(error));
	});
});

describe('POPULATE', () => {
	it('# Workout with the gym ref', (done) => {
		const workoutModel = new Workout(workouts[0]);

		workoutModel
			.populate('location')
			.execPopulate()
			.then((wo) => {
				return Gym.findById(workouts[0].location).then((gym) => {
					expect(wo.location._id.toHexString()).toBe(gym._id.toHexString());
					done();
				});
			})
			.catch(error => done(error));
	});
});

describe('UPDATE', () => {
	it('# User saving workout with too much guests', (done) => {
		const userModel = new User(users[0]);
		const workoutID = workouts[0]._id;
		const invalidGuests = ['Marc', 'Sacha', 'Wonji', 'Bum', 'Jhon'];

		userModel.subscribeWorkout(workoutID, invalidGuests)
			.then((res) => {
				done(new Error('Should not accept that much guests.'));
			}).catch((error) => {
				expect(error).toBeTruthy();
				done();
			});
	});

	it('# User saving a workout', (done) => {
		const userModel = new User(users[0]);
		const workoutID = workouts[0]._id;

		userModel.subscribeWorkout(workoutID)
			.then(() => {
				return User.findById(userModel._id)
					.then((user) => {
						expect(user.workouts.length).toBe(1);
						expect(user.workouts[0].workoutRef.toHexString()).toBe(workoutID.toHexString());

						return Workout.findById(workoutID)
							.then((workout) => {
								expect(workout.attendants.length).toBe(1);
								expect(workout.attendants[0].attendantRef.toHexString()).toBe(user._id.toHexString());
								done();
							});
					});
			}).catch(error => done(error));
	});

	// it('# User deleting a workout', (done) => {
	// 	done();
	// });
});
