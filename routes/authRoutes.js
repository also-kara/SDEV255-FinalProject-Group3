const express = require('express');
const controller = require('../controllers/authControllers')

const router = express.Router();


router.get('/login', controller.auth_login_get);
router.post('/login', controller.auth_login_post);
router.get('/signup', controller.auth_signup_get);
router.post('/signup', controller.auth_signup_post);
router.get('/logout', controller.auth_logout);


module.exports = router;