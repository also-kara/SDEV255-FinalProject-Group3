// ======== initialize modules ======== //
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');
const courseRoutes = require('./routes/courseRoutes');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const { checkUser } = require('./middleware/authMiddleware');

const app = express();


// ======== configuration ======== //

// connect to mongoDB database, then listen for requests
const dbURI = 'mongodb+srv://Developer:RyuGDt7lKk5EgKqH@nodetuts.6pkskvs.mongodb.net/SDEV266-FinalProject-DB'
mongoose.connect(dbURI)
    .then((result) => {console.log('connected to DB')})
    .then(app.listen(3000))
    .catch((err) => console.log(err))

// register view engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// app middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());


// ======== Rout Management ======== //
app.get('*', checkUser);
app.use('/auth', authRoutes);
app.use('/course', courseRoutes);
app.get('/', (req, res) => res.redirect('/course'));

// 404 error handling
app.use((req, res) => {
    res.status(404).render('404')
});