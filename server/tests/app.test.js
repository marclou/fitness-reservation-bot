const expect = require('expect');
const { ObjectID } = require('mongodb');

const { app } = require('./../app');
const {
	Gym,
	Workout,
} = require('./../models/index');
const {
	gyms,
	workouts,
	populateGyms,
	populateWorkouts,
} = require('./seeds.js');

beforeEach(populateGyms);
beforeEach(populateWorkouts);

describe('Save Documents', () => {
	it('Should save a workout with a gym name parameter', (done) => {
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

describe('Populate Documents', () => {
	it('Should populate a workout with the gym ref', (done) => {
		const workout = new Workout(workouts[0]);

		workout
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
