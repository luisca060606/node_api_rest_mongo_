const { Author } = require('../models/book.model')
const authorCtrl = {};

authorCtrl.renderAuthorForm = (req, res) => {
	res.render('authors/new_author');
};

authorCtrl.createNewAuthor = async (req, res) => {
	const { name } = req.body;
	if(!name ){
		return res.status(400).json({
			message: "All fields required"
		})
	}
	const author = new Author({name});
	try {
		const newAuthor = await author.save();
		// res.status(201).json(newAuthor);
		res.redirect('/authors/authors/all')
	} catch(error) {
		res.status(400).json({
			message: error.message
		})
	}
};

authorCtrl.renderAuthors = async (req, res) => {
	const authors = await Author.find().lean()
	res.render('authors/all_authors', {authors: authors});
};

authorCtrl.renderEditForm = async (req, res) => {
	const author = await Author.findById(req.params.id).lean();
	res.render('authors/edit_author', {author: author});
};

authorCtrl.updateAuthor = async (req, res) => {
	const { name } = req.body;
	await Author.findByIdAndUpdate(req.params.id, {name: name})
	res.redirect('/authors/authors/all')
};

authorCtrl.deleteAuthor = async (req, res) => {
	await Author.findByIdAndDelete(req.params.id)
	res.redirect('/authors/authors/all')
}

module.exports = authorCtrl;