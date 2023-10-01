const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    instructor_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    course_name: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    credit_hours: {
        type: Number,
        required: true
    },
    attendance: {
        type: Number
    },
    max_attendance: {
        type: Number
    }

}, {timestamps: true});

const Course = mongoose.model('Course', CourseSchema);

module.exports = Course;