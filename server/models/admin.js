const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
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
        validate: [passwordValidator, 'Must be at least 4 characters.'],
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

function passwordValidator(password) {
    // Escape validation in development environment.
    if (config.env === 'development') {
        return true;
    }
    return password.length > 4;
}

AdminSchema.methods.generateAuthToken = function () {
    const user = this;
    const access = 'auth';
    const token = jwt.sign({ _id: user._id.toHexString() }, config.jwtSalt);

    user.tokens = user.tokens.concat({ access, token });
    return user.save().then(() => token);
};

AdminSchema.statics.findByToken = function (token) {
    const User = this;
    let decoded;

    try {
        decoded = jwt.verify(token, config.jwtSalt);
    } catch (e) {
        return Promise.reject(e);
    }
    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth',
    });
};

AdminSchema.pre('save', function (next) {
    const admin = this;

    if (admin.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(admin.password, salt, (error, hash) => {
                admin.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

const Admin = mongoose.model('Admin', AdminSchema);

module.exports = {
    Admin,
};
