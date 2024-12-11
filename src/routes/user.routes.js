const express = require('express');
const upload = require('../helpers/storage');
const router = express.Router();
const User = require('../models/user.model');
const {
  renderSignUpForm,
  renderSignInForm,
  signUp,
  signIn,
  logOut,
  getAllUsers,
  getOneUser,
  createUser,
  loginUser,
} = require('../controllers/user.controller');
const getObject = require('../middleware/middleware_objects');
const verifyToken = require('../middleware/middleware_auth');

// init routes endpoints api
router.get('/', verifyToken, getAllUsers);
router.post('/', verifyToken, upload.single('image'), createUser);
router.get('/:id', verifyToken, getObject(User), getOneUser);
router.post('/login', loginUser);
// end routes endpoints api

// init routes ui backend with handlebars engine template
router.get('/users/signup', renderSignUpForm);
router.post('/users/signup', upload.single('image'), signUp);
router.get('/users/signin', renderSignInForm);
router.post('/users/signin', signIn);
router.get('/users/logout', logOut);
// end routes ui backend with handlebars engine template

module.exports = router;
