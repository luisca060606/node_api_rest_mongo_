const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
// template engine
const { engine } = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { config } = require('dotenv');
const path = require('path');
const passport = require('passport');
require('./config/passport');

config();

const bookRoutes = require('./routes/book.routes');
const authorRoutes = require('./routes/author.routes');
const indexRoutes = require('./routes/index.routes');
const userRoutes = require('./routes/user.routes');
const swaggerUI = require('swagger-ui-express');
const specs = require('./swagger/swagger');

// Using express for middlewares
const app = express();
// configure the app to use bodyParser()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Parser to bodys

// morgan monitoring requests server
app.use(morgan('dev'));
// override methods request, use only template engine
app.use(methodOverride('_method'));
// for messages flash from server
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
// Global variables
app.use((req, res, next) => {
  res.locals.message = req.flash('message');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});
// app.use((express.urlencoded({extended: false})));
// -- init config templates
// dir views render templates and templates engine
app.set('views', path.join(__dirname, 'views'));
app.engine(
  '.hbs',
  engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
  })
);
app.set('view engine', '.hbs');
// -- end config templates --
// static files from server
app.use(express.static(path.join(__dirname, 'public')));
// server files virtual prefix
app.use('/public', express.static(path.join(__dirname + '/storage/images')));

// Connect db mongo
// mongoose.connect(process.env.MONGO_URL, { dbName: process.env.MONGO_DB_NAME });
// (async () => {
//   const uri = await getUri();
//   await connect({ uri });
// })();
// const db = mongoose.connection;
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));
app.use('/', indexRoutes);
app.use('/books', bookRoutes);
app.use('/authors', authorRoutes);
app.use('/users', userRoutes);

const port = process.env.PORT || 3000;

// app.listen(port, () => {
//   console.log(`Server run in port ${port}`);
// });

if (require.main === module) {
  mongoose.connect(process.env.MONGO_URL, {
    dbName: process.env.MONGO_DB_NAME,
  });
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

module.exports = app;
