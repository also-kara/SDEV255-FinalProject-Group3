const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
    
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'That Email is invalid.']
    },    
    name: {
        type: String,
        required: [true, 'Name is required.']
    },
    password: {
        type: String,
        required: [true, 'Password is required.'],
        minlength: [6, 'Minimum length of the password is 6 characters long.']
    },
    instructor: {
        type: Boolean,
        default: false
    }

}, {timestamps: true});


// password hashing
UserSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

// login user method
UserSchema.statics.login = async function(email, password) {
    const user = await this.findOne({email});
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        else throw Error('Incorrect Password')
    } else throw Error('Incorrect Email')
}


const User = mongoose.model('user', UserSchema);

module.exports = User;