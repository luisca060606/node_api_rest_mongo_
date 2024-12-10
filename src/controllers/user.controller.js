const passport = require('passport');
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

module.exports = usersCtrl;
