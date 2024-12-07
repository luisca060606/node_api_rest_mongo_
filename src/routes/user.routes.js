const express = require('express');
const router = express.Router();
const User = require('../models/book.model');
const {
	renderSignUpForm,
	renderSignInForm,
	signUp,
	signIn,
	logOut
} = require('../controllers/user.controller');

router.get('/users/signup', renderSignUpForm);
router.post('/users/signup', signUp);
router.get('/users/signin', renderSignInForm);
router.post('/users/signin', signIn);
router.get('/users/logout', logOut);

module.exports = router;