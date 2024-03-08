const express = require('express')
const router = express.Router()
const Book = require('../models/book.model')

// MIDDLEWARE
const getBook = async(req, res, next) => {
	let book;
	const { id } = req.params;

	if (!id.match(/^[0-9a-fA-F]{24}$/)){
		return res.status(404).json(
			{
				message: 'El ID del libro no es valido'
			}
		)
	}
	try {
		book = await Book.findById(id)
		if(!book) {
			return res.status(404).json({message: 'El libro no fue encontrado'})
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
	const {title, author, genero, publication_date} = req?.body
	if(!title || !author || !genero || !publication_date){
		return res.status(400).json({
			message: "Todos los campos son obligatorios"
		})
	}

	const book = new Book(
		{
			title,
			author,
			genero,
			publication_date
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
		book.genero = req.body.genero || book.genero;
		book.publication_date = req.body.publication_date || book.publication_date;

		const updateBook = await book.save()
		res.json(updateBook)
	} catch(error){
		res.status(400).json({message: error.message})
	}
})

// update partial one
router.patch("/:id", getBook, async(req, res) => {
	if(!req.body.title && !req.body.author && !req.body.genero && !req.body.publication_date){
		res.status(400).json({message: 'Al menos un campo debe ser enviado'})
	}
	try {
		const book = res.book
		book.title = req.body.title || book.title;
		book.author = req.body.author || book.author;
		book.genero = req.body.genero || book.genero;
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
		res.json({message: `El libro ${book.title} se elimino correctamente`})
	} catch(error){
		res.status(500).json({message: error.message})
	}
})


module.exports = router