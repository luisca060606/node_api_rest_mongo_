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
	deleteAuthor
} = require('../controllers/author.controller')

// MIDDLEWARE
const getAuthor = async(req, res, next) => {
	let author;
	const { id } = req.params;

	if (!id.match(/^[0-9a-fA-F]{24}$/)){
		return res.status(404).json(
			{
				message: 'ID Author not exist'
			}
		)
	}
	try {
		author = await Author.findById(id)
		if(!author) {
			return res.status(404).json({message: 'Author not found'})
		}
	} catch (error) {
		return res.status(500).json({message: error.message})
	}
	res.author = author;
	next()
}

// get all authors
router.get('/', async(req, res) => {
	try {
		const authors = await Author.find()
		console.log('GET ALL', authors)
		if(authors.length === 0) {
			return res.status(204).json([])
		}
		res.json(authors)
	} catch (error) {
		res.status(500).json({message: error.message})
	}
})

// create Author
router.post('/', async(req, res) => {
	const {name} = req?.body
	if(!name ){
		return res.status(400).json({
			message: "All field required"
		})
	}

	const author = new Author(
		{
			name
		}
	)

	try {
		const newAuthor = await author.save()
		console.log(newAuthor)
		res.status(201).json(newAuthor)
	} catch(error) {
		res.status(400).json({
			message: error.message
		})
	}
})

// get one author
router.get('/:id', getAuthor, async(req, res) => {
	res.json(res.author)
})

// update one author
router.put("/:id", getAuthor, async(req, res) => {
	try {
		const author = res.author
		author.name = req.body.name || author.name;

		const updateAuthor = await author.save()
		res.json(updateAuthor)
	} catch(error){
		res.status(400).json({message: error.message})
	}
})

// update partial one
router.patch("/:id", getAuthor, async(req, res) => {
	if(!req.body.name){
		res.status(400).json({message: 'Data not send'})
	}
	try {
		const author = res.author
		author.name = req.body.name || author.name;

		const updateAuthor = await author.save()
		res.json(updateAuthor)
	} catch(error){
		res.status(400).json({message: error.message})
	}
})

// delete one author
router.delete('/:id', getAuthor, async(req, res) => {
	try {
		const author = res.author
		await author.deleteOne({
			_id: author._id
		});
		res.json({message: `Author ${author.name} eliminated correctly`})
	} catch(error){
		res.status(500).json({message: error.message})
	}
})

// build routes from controller
router.get('/authors/add', isAuthenticated, renderAuthorForm)
router.post('/authors/new-author', isAuthenticated, createNewAuthor)
router.get('/authors/all', isAuthenticated, renderAuthors)
router.get('/authors/edit/:id', isAuthenticated, renderEditForm)
router.put('/authors/edit/:id', isAuthenticated, updateAuthor)
router.delete('/authors/delete/:id', isAuthenticated, deleteAuthor)

module.exports = router