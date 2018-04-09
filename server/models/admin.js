const mongoose = require('mongoose');

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

function emailValidator() {
    return this.email === 'marc.louvion@gmail.com' || 'wonji@gmail.com';
}

const Admin = mongoose.model('Admin', AdminSchema);

module.exports = {
    Admin,
};
