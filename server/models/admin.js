const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('./../../config');

const AdminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: [emailValidator, 'Must be a valid Admin Email'],
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    tokens: [
        {
            access: {
                type: String,
                required: true,
            },
            token: {
                type: String,
                required: true,
            },
        },
    ],
});

function emailValidator(email) {
    // Escape validation in development environment.
    if (config.env === 'development') {
        return true;
    }
    return email === 'marc.louvion@gmail.com';
}

AdminSchema.methods.generateAuthToken = function () {
    const user = this;
    const access = 'auth';
    const token = jwt.sign({ _id: user._id.toHexString() }, '123ABC');

    user.tokens = user.tokens.concat({ access, token });
    return user.save().then(() => token);
};

const Admin = mongoose.model('Admin', AdminSchema);

module.exports = {
    Admin,
};
