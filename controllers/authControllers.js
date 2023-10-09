const User = require('../models/Users');
const jwt = require('jsonwebtoken');


const handleErrors = (err) => {
    console.log(err.message, err.code)

    let errors = {email: '', password: '', };

    // incorrect email
    if (err.message === 'Incorrect Email') {
        errors.email = "Incorrect Email"
    }
    if (err.message === 'Incorrect Password') {
        errors.password = "Incorrect Password"
    }

    // duplicate error code
    if (err.code === 11000) {
        errors.email = 'that email is already registered';
        return errors;
    }

    //validation erros
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        });
    }

    return errors
}

// create Json Web Token 
const secrete = 'Univ7ersity o6f Dra5gons a4nd lo3ng ra2mbly stri1ngs';
const maxAge = 3 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({id}, secrete, {expiresIn: maxAge});
}

// Log in
module.exports.auth_login_get = (req, res) => {
    res.render('auth/login');
};

module.exports.auth_login_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000});
        res.status(200).json({user: user._id});
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
};


// Signup
module.exports.auth_signup_get = (req, res) => {
    res.render('auth/signup');
};

module.exports.auth_signup_post = async (req, res) => {
    const { email, name, password, instructorCode } = req.body;

    let instructor = false;
    if (instructorCode === 'Team3') {instructor = true}
        
    try{
        const user = await User.create({email, name, password, instructor});
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000})
        res.status(201).json({user: user._id});
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
};


// Logout
module.exports.auth_logout = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
};