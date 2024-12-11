const express = require('express');
const router = express.Router();
const { Author } = require('../models/book.model');
const { isAuthenticated } = require('../helpers/auth');

// import from controller
const {
  renderAuthorForm,
  createNewAuthor,
  renderAuthors,
  renderEditForm,
  updateAuthor,
  deleteAuthor,
  getAllAuthors,
  createAuthor,
  getOneAuthor,
  upgradeAuthor,
  upgradePartialAuthor,
  deleteOneAuthor,
} = require('../controllers/author.controller');
const getObject = require('../middleware/middleware_objects');
const verifyToken = require('../middleware/middleware_auth');

// init routes endpoints api rest Authors
router.get('/', verifyToken, getAllAuthors);
router.post('/', verifyToken, createAuthor);
router.get('/:id', verifyToken, getObject(Author), getOneAuthor);
router.put('/:id', verifyToken, getObject(Author), upgradeAuthor);
router.patch('/:id', verifyToken, getObject(Author), upgradePartialAuthor);
router.delete('/:id', verifyToken, getObject(Author), deleteOneAuthor);
// end routes endpoints api rest Authors

// build routes from controller for backendUI with template engine handlebars
router.get('/authors/add', isAuthenticated, renderAuthorForm);
router.post('/authors/new-author', isAuthenticated, createNewAuthor);
router.get('/authors/all', isAuthenticated, renderAuthors);
router.get('/authors/edit/:id', isAuthenticated, renderEditForm);
router.put('/authors/edit/:id', isAuthenticated, updateAuthor);
router.delete('/authors/delete/:id', isAuthenticated, deleteAuthor);
// ende routes backendUI

module.exports = router;
