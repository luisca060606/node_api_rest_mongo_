const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    user_register: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
const Author = mongoose.model('Author', authorSchema);

const bookSchema = new mongoose.Schema(
  {
    title: String,
    genre: String,
    publication_date: String,
    author: { type: mongoose.Types.ObjectId, ref: 'Author' },
  },
  {
    timestamps: true,
  }
);
const Book = mongoose.model('Book', bookSchema);

module.exports = { Author, Book };
