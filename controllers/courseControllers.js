const { includes } = require('lodash');
const Course = require('../models/Courses');
const User = require('../models/Users');


const clearIDfromAllCourseLists = (id) => {
    const removeItem = (arr, item) => {
        let newArray = [...arr]
        const index = newArray.findIndex((element) => element == item)
        if(index != -1) {
            newArray.splice(index, 1) 
        }
        return newArray
    
    }

    User.find()
    .then(async (result) => {
        for (let user of result) {

            console.log(user.courses)
            let newArray = removeItem(user.courses, id)
            console.log(newArray)
            console.log(user._id)
            await User.findByIdAndUpdate(user._id, { courses: newArray } )
        }
    })
    .catch((err) => console.log(err))

}


// index page
module.exports.course_index = (req, res) => {
    Course.find().sort({createdAt: -1})
    .then((result) => {
        res.render('course/index', {courses: result});
    })
    .catch((err) => console.log(err))
}


// Add Course
module.exports.course_add_get = (req, res) => {
    res.render('course/add')
};

module.exports.course_add_post = (req, res) => {
    const course = new Course(req.body);
    course.save()
        .then((result) => res.redirect('/'))
        .catch((err) => console.log(err))
};


// Update a Course
module.exports.course_update_get = (req, res) => {
    const id = req.params.id;
    Course.findById(id)
        .then((courseResult) => {
            //get the instructor name
            let instID = courseResult.instructor_id;
            if (instID != null) {
                User.findById(instID)
                    .then((instructorResult) =>{ instructor = instructorResult.name; }) 
            } else {instructor = "Unknown"}
            res.render('course/edit', {course: courseResult, instructor});
        })
        .catch(err => console.log(err));
};

module.exports.course_update_post = (req, res) => {
    const id = req.params.id
    const course = {
        course_name: req.body.course_name,
        subject: req.body.subject,
        description: req.body.description,
        max_attendance: req.body.max_attendance,
        credit_hours: req.body.credit_hours,
    }
    Course.findByIdAndUpdate(id, course)
    .then(result => { 
        res.redirect('/course')
    })
    .catch(err => console.log(err))
};


// Delete a Course
module.exports.course_delete = (req, res) => {
    const id = req.params.id;
    
    Course.findByIdAndDelete(id)
        .then(result => { 
            //remove items from users course lists
            clearIDfromAllCourseLists(id)
            //redirect to homepage
            res.json({redirect: '/'})
        })
        .catch(err => console.log(err))
};


// Course details page.
module.exports.course_get = (req, res) => {
    const id = req.params.id; 
    Course.findById(id)
        .then((courseResult) => {
            //get the instructor name
            let instID = courseResult.instructor_id;
            if (instID != null) {
                User.findById(instID)
                    .then((instructorResult) =>{ 
                        instructor = instructorResult.name; 
                        res.render('course/details', {course: courseResult, instructor, instID: instructorResult._id})
                    }) 
            } else {
                instructor = "Unknown"
                res.render('course/details', {course: courseResult, instructor, instID: null})
            }
             
        })
    .catch(err => console.log(err))
};


// my courses page.
module.exports.myCourses_get = (req, res) => {
    Course.find().sort({createdAt: -1})
    .then((result) => {
        res.render('course/my-courses', {courses: result});
    })
    .catch((err) => console.log(err))
}


module.exports.myCourses_post = async (req, res) => {
    //define what user we are working with an the course id we are adding
    const userID = req.params.userID;
    const courseID = req.params.courseID;
    
    User.findById(userID).then((user) => {
        let userCourseList = user.courses;

        if (userCourseList.includes(courseID)) {
            console.log("that course is already included");
        } else {
            userCourseList.push(courseID)
            User.findByIdAndUpdate(userID, {
                courses: userCourseList 
            })
            .catch(err => console.log(err))
        }
        })
    .then(result => { 
        res.json({redirect: '/course/my-courses'})
    })
    .catch(err => console.log(err))
};


module.exports.myCourses_delete = async (req, res) => {
    //define what user we are working with an the course id we are adding
    const userID = req.params.userID;
    const courseID = req.params.courseID;
    
    User.findById(userID).then((user) => {
        let userCourseList = user.courses;

        if (userCourseList.includes(courseID)) {
            userCourseList.pop(courseID)
            User.findByIdAndUpdate(userID, {
                courses: userCourseList 
            })
            .catch(err => console.log(err))
        } else {
            console.log("that course is already included");
        }
    })
    .then(result => { 
        res.json({redirect: '/course/my-courses'})
    })
    .catch(err => console.log(err))
};