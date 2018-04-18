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
    return config.adminMail.indexOf(email) > -1;
}

function passwordValidator(password) {
    // Escape validation in development environment.
    if (config.env === 'development') {
        return true;
    }
    return password.length > 6;
}

AdminSchema.methods.generateAuthToken = function () {
    const admin = this;
    const access = 'auth';
    const token = jwt.sign({ _id: admin._id.toHexString() }, config.secret);

    admin.tokens = admin.tokens.concat({ access, token });
    return admin.save().then(() => token);
};

AdminSchema.statics.findByToken = function (token) {
    const Admin = this;
    let decoded;

    try {
        decoded = jwt.verify(token, config.secret);
    } catch (e) {
        return Promise.reject(e);
    }
    return Admin.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth',
    });
};

AdminSchema.statics.findByCreditentials = function (email, password) {
    const Admin = this;

    return Admin.findOne({ email }).then((admin) => {
        if (!admin) {
            return Promise.reject(new Error('Email doesn\'t exist'));
        }
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, admin.password, (err, res) => {
                if (res) {
                    return resolve(admin);
                }
                reject(new Error('Incorrect Password'));
            });
        });
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
