const express = require('express')
const morgan = require('morgan')
const moethodOverride = require('method-override')
// template engine
const { engine } = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const { config } = require('dotenv')
const path = require('path')

config()

const bookRoutes = require('./routes/book.routes')
const authorRoutes = require('./routes/author.routes')
const indexRoutes = require('./routes/index.routes')

// Using express for middlewares
const app = express();
// configure the app to use bodyParser()
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json()); // Parser to bodys
// morgan monitoring requests server
app.use(morgan('dev'));
// override methods request, use only template engine
app.use(moethodOverride('_method'))
// app.use((express.urlencoded({extended: false})));
// -- init config templates
// dir views render templates and templates engine
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', engine({
	defaultLayout: 'main',
	layoutsDir: path.join(app.get('views'), 'layouts'),
	partialsDir: path.join(app.get('views'), 'partials'),
	extname: '.hbs'
}))
app.set('view engine', '.hbs')
// -- end config templates --
// static files from server
app.use(express.static(path.join(__dirname, 'public')));

// Connect db mongo
mongoose.connect(process.env.MONGO_URL, {dbName: process.env.MONGO_DB_NAME})
const db = mongoose.connection;

app.use('/', indexRoutes)
app.use('/books', bookRoutes)
app.use('/authors', authorRoutes)

const port = process.env.PORT || 3000

app.listen(port, () => {
	console.log(`Server run in port ${port}`)
})