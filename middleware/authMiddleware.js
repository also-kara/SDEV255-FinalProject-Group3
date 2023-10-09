const jwt = require('jsonwebtoken');
const User = require('../models/Users');


const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    const secrete = 'Univ7ersity o6f Dra5gons a4nd lo3ng ra2mbly stri1ngs';

    // check for cookie
    if (token) {
        jwt.verify(token, secrete, (err, decodedToken) => {
            if (err) {
                console.log(err);
                res.redirect('/auth/login')
            } else {
                console.log(decodedToken)
                next();
            }
        })
    } else {
        res.redirect('/auth/login')
    }
}

// check current user
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    const secrete = 'Univ7ersity o6f Dra5gons a4nd lo3ng ra2mbly stri1ngs';

    if (token) {
        jwt.verify(token, secrete, async (err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                console.log(err);
                next();
            } else {
                console.log(decodedToken)
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        })
    } else {
        res.locals.user = null;
        next();
    }
}

// only allow teachers
const instructorOnly = (req, res, next) => {
    const token = req.cookies.jwt;
    const secrete = 'Univ7ersity o6f Dra5gons a4nd lo3ng ra2mbly stri1ngs';

    if (token) {
        jwt.verify(token, secrete, async (err, decodedToken) => {
            if (err) {
                console.log(err);
                res.redirect('/auth/login')
            } else {
                console.log(decodedToken)
                let user = await User.findById(decodedToken.id);
                if (user.instructor) {next();}
                else {res.redirect('/auth/login')}
            }
        })
    } else {
        res.redirect('/auth/login')
    }
}

module.exports = { requireAuth, checkUser, instructorOnly }