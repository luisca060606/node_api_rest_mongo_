const express = require('express');
const router = express.Router();
const { Book } = require('../models/book.model');
const {
  getAllBooks,
  createBook,
  getOneBook,
  upgradeBook,
  upgradePartialBook,
  deleteBook,
} = require('../controllers/book.controller');
const getObject = require('../middleware/middleware_objects');
const verifyToken = require('../middleware/middleware_auth');

// init endpoints api rest Books
router.get('/', verifyToken, getAllBooks);
router.post('/', verifyToken, createBook);
router.get('/:id', verifyToken, getObject(Book), getOneBook);
router.put('/:id', verifyToken, getObject(Book), upgradeBook);
router.patch('/:id', verifyToken, getObject(Book), upgradePartialBook);
router.delete('/:id', verifyToken, getObject(Book), deleteBook);
// end endpoints api rest Books

module.exports = router;
