// initialize modules
const express = require('express');
const path = require('path');

const app = express();


// register view engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// app configuration
app.use(express.static(path.join(__dirname, 'public')));

// listen for requests
const webDoor = app.listen(3000);


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