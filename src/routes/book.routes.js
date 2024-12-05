const express = require('express')
const router = express.Router()
const { Book } = require('../models/book.model')

// MIDDLEWARE
const getBook = async(req, res, next) => {
	let book;
	const { id } = req.params;

	if (!id.match(/^[0-9a-fA-F]{24}$/)){
		return res.status(404).json(
			{
				message: 'ID book not found'
			}
		)
	}
	try {
		book = await Book.findById(id)
		if(!book) {
			return res.status(404).json({message: 'Book not found'})
		}
	} catch (error) {
		return res.status(500).json({message: error.message})
	}
	res.book = book;
	next()
}

// obtener todos los libros
router.get('/', async(req, res) => {
	try {
		const books = await Book.find()
		console.log('GET ALL', books)
		if(books.length === 0) {
			return res.status(204).json([])
		}
		res.json(books)
	} catch (error) {
		res.status(500).json({message: error.message})
	}
})

// Crear un nuevo libro (recurso)
router.post('/', async(req, res) => {
	const {title, genre, publication_date, author} = req?.body
	if(!title || !genre || !publication_date || !author){
		console.log(title)
		console.log(genre)
		console.log(publication_date)
		console.log(author)
		return res.status(400).json({
			message: "All fields required"
		})
	}

	const book = new Book(
		{
			title,
			genre,
			publication_date,
			author
		}
	)

	try {
		const newBook = await book.save()
		console.log(newBook)
		res.status(201).json(newBook)
	} catch(error) {
		res.status(400).json({
			message: error.message
		})
	}
})
// get one
router.get('/:id', getBook, async(req, res) => {
	res.json(res.book)
})

// update one
router.put("/:id", getBook, async(req, res) => {
	try {
		const book = res.book
		book.title = req.body.title || book.title;
		book.author = req.body.author || book.author;
		book.genre = req.body.genre || book.genre;
		book.publication_date = req.body.publication_date || book.publication_date;

		const updateBook = await book.save()
		res.json(updateBook)
	} catch(error){
		res.status(400).json({message: error.message})
	}
})

// update partial one
router.patch("/:id", getBook, async(req, res) => {
	if(!req.body.title && !req.body.author && !req.body.genre && !req.body.publication_date){
		res.status(400).json({message: 'Data not send'})
	}
	try {
		const book = res.book
		book.title = req.body.title || book.title;
		book.author = req.body.author || book.author;
		book.genre = req.body.genre || book.genre;
		book.publication_date = req.body.publication_date || book.publication_date;

		const updateBook = await book.save()
		res.json(updateBook)
	} catch(error){
		res.status(400).json({message: error.message})
	}
})

// delete one
router.delete('/:id', getBook, async(req, res) => {
	try {
		const book = res.book
		await book.deleteOne({
			_id: book._id
		});
		res.json({message: `The book ${book.title} eliminated correctly`})
	} catch(error){
		res.status(500).json({message: error.message})
	}
})


module.exports = router