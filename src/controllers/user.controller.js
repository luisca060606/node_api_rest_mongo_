const passport = require('passport');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES } = require('../config');
const usersCtrl = {};
const User = require('../models/user.model');

usersCtrl.renderSignUpForm = (req, res) => {
  res.render('users/signup');
};

usersCtrl.signUp = async (req, res) => {
  const errors = [];
  const { name, email, password, confirm_password } = req.body;
  if (password != confirm_password) {
    errors.push({ text: 'Passwords do not match' });
  }
  if (password.length < 6) {
    errors.push({ text: 'Passwords must be at least 6 characters' });
  }
  if (errors.length > 0) {
    res.render('users/signup', { errors, name, email });
  } else {
    const emailUser = await User.findOne({ email: email });
    if (emailUser) {
      req.flash('error_msg', 'The email is already in use');
      res.redirect('/users/users/signup');
    } else {
      const newuser = new User({ name, email, password });
      if (req.file) {
        const { filename } = req.file;
        newuser.image = await newuser.setImageUrl(filename);
      }
      newuser.password = await newuser.encrypPassword(password);
      await newuser.save();
      req.flash('message', 'User registered');
      res.redirect('/users/users/signin');
    }
  }
};

usersCtrl.renderSignInForm = (req, res) => {
  res.render('users/signin');
};

usersCtrl.signIn = passport.authenticate('local', {
  failureRedirect: '/users/users/signin',
  successRedirect: '/authors/authors/all',
  failureFlash: true,
});

usersCtrl.logOut = async (req, res, next) => {
  await req.logout((err) => {
    if (err) return next(err);
    req.flash('message', 'You are logged out now.');
    res.redirect('/users/users/signin');
  });
};

// init controllers apip users
usersCtrl.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      return res.status(204).json([]);
    }
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

usersCtrl.getOneUser = async (req, res) => {
  res.json(res.object);
};

usersCtrl.createUser = async (req, res) => {
  const { name, email, password, confirm_password } = req.body;
  if (!name || !email || !password || !confirm_password) {
    return res.status(400).json({
      message: 'All fields required',
    });
  }
  if (password != confirm_password) {
    return res.status(400).json({
      message: 'Password do not match.',
    });
  }
  if (password.length < 6) {
    return res.status(400).json({
      message: 'Passwords must be at least 6 characters',
    });
  }
  const emailUser = await User.findOne({ email: email });
  if (emailUser) {
    return res.status(400).json({
      message: 'The email is already in use',
    });
  } else {
    const newuser = new User({ name, email, password });
    try {
      if (req.file) {
        const { filename } = req.file;
        newuser.image = await newuser.setImageUrl(filename);
      }
      newuser.password = await newuser.encrypPassword(password);
      await newuser.save();
      res.status(200).json({ isSuccess: true, message: 'User created.' });
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  }
};

usersCtrl.loginUser = async (req, res) => {
  try {
    console.log(req?.body);
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: 'Not send credentials',
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      // return jwt
      const match = await user.matchPassword(password);
      if (match) {
        const token = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET, {
          expiresIn: JWT_EXPIRES,
        });
        const user_info = { id: user.id, name: user.name };
        return res
          .status(200)
          .json({ user: user_info, isSuccess: true, token: token });
      } else {
        return res.status(400).json({ message: 'Password incorrect' });
      }
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    return res.status(500).json({ isSuccess: false, message: [error.message] });
  }
};
// end controllers api usrs

module.exports = usersCtrl;
