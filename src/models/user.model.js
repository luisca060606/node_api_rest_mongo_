const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { APP_HOST, PORT } = require('../config');

const userSchema = new mongoose.Schema(
	{
		name: {type: String, required: true},
		email: {type: String, required: true, unique: true},
		password: {type: String, required: true},
		image: {type: String}
	},
	{
		timestamps: true
	}
)

userSchema.methods.setImageUrl = async filename => {
	return await `${APP_HOST}:${PORT}/public/${filename}`;
}

userSchema.methods.encrypPassword = async password => {
	const salt = await bcrypt.genSalt(10);
	return await bcrypt.hash(password, salt);
};

userSchema.methods.matchPassword = async function(password) {
	return await bcrypt.compare(password, this.password);
}

// export andcreate model mongoose
module.exports = mongoose.model('User', userSchema)