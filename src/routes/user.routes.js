const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES } = require('../config');
const User = require('../models/user.model');
const {
	renderSignUpForm,
	renderSignInForm,
	signUp,
	signIn,
	logOut
} = require('../controllers/user.controller');
const getObject = require('../middleware/middleware_objects');
const verifyToken = require('../middleware/middleware_auth');

// init routes endpoints api
// get all users
router.get('/', verifyToken, async(req, res) => {
	try {
		const users = await User.find();
		if(users.length === 0) {
			return res.status(204).json([]);
		}
		res.json(users);
	} catch (error) {
		res.status(500).json({message: error.message});
	}
});

// create a User
router.post('/', async(req, res) => {
	const { name, email, password, confirm_password } = req.body;
	if(!name || !email || !password || !confirm_password){
		return res.status(400).json({
			message: "All fields required"
		})
	}
	if (password != confirm_password) {
		return res.status(400).json({
			message: "Password do not match."
		})
	}
	if (password.length < 6) {
		return res.status(400).json({
			message: 'Passwords must be at least 6 characters'
		})		
	}
	const emailUser = await User.findOne({email: email});
	if (emailUser) {
		return res.status(400).json({
			message: "The email is already in use"
		})
	} else {
		const newuser = new User({name, email, password});
		try {
			newuser.password = await newuser.encrypPassword(password);
			await newuser.save();
			res.status(200).json({isSuccess: true, message: 'User created.'})
		} catch(error) {
			res.status(400).json({
				message: error.message
			})
		}		
	}	
})

// get one user
router.get('/:id', getObject(User), async(req, res) => {
	res.json(res.object);
});

// login api
router.post('/login', async(req, res) => {
	try {
		const { email, password } = req.body;
		if(!email || !password){
			return res.status(400).json({
				message: "Not send credentials"
			});
		}	
		const user = await User.findOne({email})
		if (user) {
			// return jwt
			const match = await user.matchPassword(password);
			if (match) {
				const token = jwt.sign(
					{id: user.id, name: user.name},
					JWT_SECRET,
					{expiresIn: JWT_EXPIRES}
				);
				const user_info = {id: user.id, name: user.name};
				return res.status(200).json({user: user_info, isSuccess: true, token: token});
			} else {
				return res.status(400).json({message: 'Password incorrect'});
			}
			
		} else {
			return res.status(404).json({message: 'User not found'});
		}
	} catch (error) {
		return res.status(500).json({isSuccess: false, message: [error.message]});
	}
})
// end routes endpoints api


// routes ui backend with handlebars engine template
router.get('/users/signup', renderSignUpForm);
router.post('/users/signup', signUp);
router.get('/users/signin', renderSignInForm);
router.post('/users/signin', signIn);
router.get('/users/logout', logOut);

module.exports = router;