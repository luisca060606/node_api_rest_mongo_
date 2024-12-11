const bookCtrl = {};
const { Book } = require('../models/book.model');

bookCtrl.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    if (books.length === 0) {
      return res.status(204).json([]);
    }
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

bookCtrl.createBook = async (req, res) => {
  const { title, genre, publication_date, author } = req.body;
  if (!title || !genre || !publication_date || !author) {
    return res.status(400).json({
      message: 'All fields required',
    });
  }

  const book = new Book({
    title,
    genre,
    publication_date,
    author,
  });

  try {
    const newBook = await book.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

bookCtrl.getOneBook = async (req, res) => {
  res.status(200).json(res.object);
};

bookCtrl.upgradeBook = async (req, res) => {
  try {
    const book = res.object;
    book.title = req.body.title || book.title;
    book.author = req.body.author || book.author;
    book.genre = req.body.genre || book.genre;
    book.publication_date = req.body.publication_date || book.publication_date;

    const updateBook = await book.save();
    res.json(updateBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

bookCtrl.upgradePartialBook = async (req, res) => {
  if (
    !req.body.title &&
    !req.body.author &&
    !req.body.genre &&
    !req.body.publication_date
  ) {
    res.status(400).json({ message: 'Data not send' });
  }
  try {
    const book = res.object;
    book.title = req.body.title || book.title;
    book.author = req.body.author || book.author;
    book.genre = req.body.genre || book.genre;
    book.publication_date = req.body.publication_date || book.publication_date;

    const updateBook = await book.save();
    res.json(updateBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

bookCtrl.deleteBook = async (req, res) => {
  try {
    const book = res.object;
    await book.deleteOne({
      _id: book._id,
    });
    res.json({ message: `The book ${book.title} eliminated correctly` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = bookCtrl;
