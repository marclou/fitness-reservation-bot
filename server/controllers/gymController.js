const _ = require('lodash');
const { Gym } = require('./../models/index');

module.exports = {
    list: (req, res) => {
    	Gym.find({}).then((gyms) => {
    		if (!gyms) {
    			return res.status(404).send({
    				error: 'No gyms added yet.',
    			});
    		}
    		res.status(200).send({ gyms });
    	}).catch((error) => {
    		res.status(400).send({ error });
    	});
    },

    createOne: (req, res) => {
    	const gymToAdd = _.pick(req.body, ['name', 'address', 'maxAttendance', 'facilities']);
    	const gymDoc = new Gym(gymToAdd);

    	gymDoc.save().then((gym) => {
    		if (!gym) {
    			return res.status(404).send({ error: 'Can\'t save gym' });
    		}
    		res.status(200).send({ gym });
    	}).catch((error) => {
    		res.status(400).send({ error });
    	});
    },
};
