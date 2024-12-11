const { Author } = require('../models/book.model');
const authorCtrl = {};

// init backendui UI endpoints
authorCtrl.renderAuthorForm = (req, res) => {
  res.render('authors/new_author');
};

authorCtrl.createNewAuthor = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({
      message: 'All fields required',
    });
  }
  const author = new Author({ name });
  author.user_register = req.user.id;
  try {
    const newAuthor = await author.save();
    req.flash('message', 'Author added successfully');
    // res.status(201).json(newAuthor);
    res.redirect('/authors/authors/all');
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

authorCtrl.renderAuthors = async (req, res) => {
  const authors = await Author.find({ user_register: req.user.id })
    .sort({ createdAt: 'desc' })
    .lean();
  res.render('authors/all_authors', { authors: authors });
};

authorCtrl.renderEditForm = async (req, res) => {
  const author = await Author.findById(req.params.id).lean();
  if (author.user_register != req.user.id) {
    req.flash('error_msg', 'Not authorized');
    return res.redirect('/authors/authors/all');
  }
  res.render('authors/edit_author', { author: author });
};

authorCtrl.updateAuthor = async (req, res) => {
  const { name } = req.body;
  await Author.findByIdAndUpdate(req.params.id, { name: name });
  req.flash('message', 'Author updated successfully');
  res.redirect('/authors/authors/all');
};

authorCtrl.deleteAuthor = async (req, res) => {
  await Author.findByIdAndDelete(req.params.id);
  req.flash('message', 'Author eliminated');
  res.redirect('/authors/authors/all');
};
// end backend UI endpoints

// init endpoints api manage authors
authorCtrl.getAllAuthors = async (req, res) => {
  try {
    const authors = await Author.find();
    if (authors.length === 0) {
      return res.status(204).json([]);
    }
    res.json(authors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

authorCtrl.createAuthor = async (req, res) => {
  const { name, user_register } = req.body;
  if (!name && !user_register) {
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
};

authorCtrl.getOneAuthor = async (req, res) => {
  res.status(200).json(res.object);
};

authorCtrl.upgradeAuthor = async (req, res) => {
  try {
    const author = res.object;
    author.name = req.body.name || author.name;
    author.user_register = req.body.user_register || author.user_register;

    const updateAuthor = await author.save();
    res.status(200).json(updateAuthor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

authorCtrl.upgradePartialAuthor = async (req, res) => {
  console.log(req.body.name);
  console.log(!req.body.user_register);
  if (!req.body.name && !req.body.user_register) {
    res.status(400).json({ message: 'Data not send' });
  }
  try {
    const author = res.object;
    author.name = req.body.name || author.name;
    author.user_register = req.body.user_register || author.user_register;

    const updateAuthor = await author.save();
    res.status(200).json(updateAuthor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

authorCtrl.deleteOneAuthor = async (req, res) => {
  try {
    const author = res.object;
    await author.deleteOne({
      _id: author._id,
    });
    res
      .status(200)
      .json({ message: `Author ${author.name} eliminated correctly` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// end endpoints api manage authors

module.exports = authorCtrl;
