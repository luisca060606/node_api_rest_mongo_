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
} = require('../controllers/author.controller');
const getObject = require('../middleware/middleware_objects');
const verifyToken = require('../middleware/middleware_auth');

// init routes endpoints api
// get all authors
router.get('/', verifyToken, async (req, res) => {
  try {
    const authors = await Author.find();
    console.log('GET ALL', authors);
    if (authors.length === 0) {
      return res.status(204).json([]);
    }
    res.json(authors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// create Author
router.post('/', verifyToken, async (req, res) => {
  const { name, user_register } = req.body;
  if (!name) {
    return res.status(400).json({
      message: 'All field required',
    });
  }

  const author = new Author({
    name,
    user_register,
  });

  try {
    const newAuthor = await author.save();
    res.status(201).json(newAuthor);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

// get one author
router.get('/:id', verifyToken, getObject(Author), async (req, res) => {
  res.json(res.object);
});

// update one author
router.put('/:id', verifyToken, getObject(Author), async (req, res) => {
  try {
    const author = res.object;
    author.name = req.body.name || author.name;

    const updateAuthor = await author.save();
    res.json(updateAuthor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// update partial one
router.patch('/:id', verifyToken, getObject(Author), async (req, res) => {
  if (!req.body.name) {
    res.status(400).json({ message: 'Data not send' });
  }
  try {
    const author = res.object;
    author.name = req.body.name || author.name;

    const updateAuthor = await author.save();
    res.json(updateAuthor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// delete one author
router.delete('/:id', verifyToken, getObject(Author), async (req, res) => {
  try {
    const author = res.object;
    await author.deleteOne({
      _id: author._id,
    });
    res.json({ message: `Author ${author.name} eliminated correctly` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// end routes endpoints api

// build routes from controller for backendUI with template engine handlebars
router.get('/authors/add', isAuthenticated, renderAuthorForm);
router.post('/authors/new-author', isAuthenticated, createNewAuthor);
router.get('/authors/all', isAuthenticated, renderAuthors);
router.get('/authors/edit/:id', isAuthenticated, renderEditForm);
router.put('/authors/edit/:id', isAuthenticated, updateAuthor);
router.delete('/authors/delete/:id', isAuthenticated, deleteAuthor);

module.exports = router;
