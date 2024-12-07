const { config } = require('dotenv');
config();

var_config = {};

var_config.PORT = process.env.PORT
var_config.DB_URL = process.env.MONGO_URL
var_config.JWT_SECRET = process.env.JWT_SECRET
var_config.JWT_EXPIRES = process.env.JWT_EXPIRES

module.exports = var_config;