const { Router } = require('express')
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');


const verifyToken = Router()

verifyToken.use((req, res, next) => {
	let token = req.headers['x/access-token'] || req.headers['authorization']

	if (!token) {
		return res.status(401).json({status: false, errors: ['Not authorized']})
	}
	if (token.startsWith('Bearer')) {
		token = token.slice(7, token.length)
		jwt.verify(token, JWT_SECRET, (error, decoded) => {
			if (error) {
				return res.status(401).json({status: false, errors:['Invalid Token']})
			} else {
				req.decoded = decoded
				next()
			}
		})
	}
})

module.exports = verifyToken;