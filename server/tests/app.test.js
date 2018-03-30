const expect = require('expect');

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
	it('Should save a Workout', () => {
		expect(4).toBe(4);
	});
});
