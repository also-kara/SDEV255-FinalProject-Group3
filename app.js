// initialize modules
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/Users');
const Course = require('./models/Courses');

const app = express();


// connect to mongoDB database, then listen for requests
const dbURI = 'mongodb+srv://Developer:RyuGDt7lKk5EgKqH@nodetuts.6pkskvs.mongodb.net/SDEV266-FinalProject-DB'
mongoose.connect(dbURI)
    .then((result) => {console.log('connected to DB')})
    .then(app.listen(3000))
    .catch((err) => console.log(err))

// register view engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// app configuration
app.use(express.static(path.join(__dirname, 'public')));

// prossess response
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/login/signup', (req, res) => {
    res.render('signup');
});

app.get('/courses/add', (req, res) => {
    res.render('course_new');
});


// 404 error handling
app.use((req, res) => {
    res.status(404).render('404')
});