const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    
    email: {
        type: String,
        required: true
    },    
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    instructor: {
        type: Boolean
    }

}, {timestamps: true});

const User = mongoose.model('User', UserSchema);

module.exports = User;