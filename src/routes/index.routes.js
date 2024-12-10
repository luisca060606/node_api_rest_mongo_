const express = require('express');
const router = express.Router();
const { renderIndex, renderAbout } = require('../controllers/index.controller');
const { isAuthenticated } = require('../helpers/auth');

router.get('/', renderIndex);
router.get('/about', isAuthenticated, renderAbout);

module.exports = router;
