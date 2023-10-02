const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    
    email: {
        type: String,
        required: true
    },    
    name: {
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

const user = mongoose.model('User', UserSchema);

module.exports = user;