const passport = require('passport');
// for use localdatabse and not other services, facebook, google...
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user.model');

passport.use(new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password'
}, async (email, password, done) => {
	// confirm exist email
	const user = await User.findOne({email})
	if (!user) {
		return done(null, false, {message: 'User not found'});
	} else {
		// match password user
		const match = await user.matchPassword(password);
		if (match) {
			return done(null, user);
		} else {
			return done(null, false, {message: 'Password wrong'});
		}
	}
}));

passport.serializeUser((user, done) => {
	done(null, user.id);
})

passport.deserializeUser(async (id, done) => {
	// User.findById(id, function(err, user) {
	// 	done(err, user);
	// })
	User.findById(id).then(user => {
		done(null, user);
	})
	.catch(err => {
		done(err, null);
	});
})
