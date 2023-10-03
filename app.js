// ======== initialize modules ======== //
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');
const user = require('./models/Users');
const course = require('./models/Courses');

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

// app configuration
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));


// ======== Rout Management ======== //

// index page
app.get('/', (req, res) => res.redirect('/course'));
app.get('/course', (req, res) => {
    course.find().sort({createdAt: -1})
    .then((result) => {
        res.render('index', {courses: result, user: result});
    })
    .catch((err) => console.log(err))
    
});


// Login and signup pages
app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/login/signup', (req, res) => {
    res.render('signup');
});


// Add Course
app.get('/course/add', (req, res) => res.render('course_new'));
app.post('/course/add', (req, res) => {
    const Course = new course(req.body);
    Course.save()
        .then((result) => res.redirect('/'))
        .catch((err) => console.log(err))
});

// Update a Course
app.get('/course/update/:id', (req, res) => {
    const id = req.params.id;
    course.findById(id)
        .then((courseResult) => {
            //get the instructor name
            let instID = courseResult.instructor_id;
            if (instID != null) {
                user.findById(instID)
                    .then((instructorResult) =>{ instructor = instructorResult.name; }) 
            } else {instructor = "Unknown"}
            res.render('course_edit', {course: courseResult, instructor});
        })
        .catch(err => console.log(err));
});

app.post('/course/update/:id', (req, res) => {
    const id = req.params.id
    const Course = {
        course_name: req.body.course_name,
        subject: req.body.subject,
        description: req.body.description,
        max_attendance: req.body.max_attendance,
        credit_hours: req.body.credit_hours,
    }
    course.findByIdAndUpdate(id, Course)
    .then(result => { 
        res.redirect('/course')
    })
    .catch(err => console.log(err))
    
  })

// Delete a Course
app.delete('/course/:id', (req, res) => {
    const id = req.params.id;
    
    course.findByIdAndDelete(id)
        .then(result => { 
            res.json({redirect: '/'})
        })
        .catch(err => console.log(err))
});

// Course details page.
app.get('/course/:id', (req, res) => {
    const id = req.params.id;
    course.findById(id)
        .then((courseResult) => {
            //get the instructor name
            let instID = courseResult.instructor_id;
            if (instID != null) {
                user.findById(instID)
                    .then((instructorResult) =>{ 
                        instructor = instructorResult.name; 
                        res.render('details', {course: courseResult, instructor})
                    }) 
            } else {
                instructor = "Unknown"
                res.render('details', {course: courseResult, instructor})
            }
             
        })
    .catch(err => console.log(err))
});


// 404 error handling
app.use((req, res) => {
    res.status(404).render('404')
});