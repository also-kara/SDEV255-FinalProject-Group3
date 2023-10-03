const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    instructor_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        default: null
    },
    course_name: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    description: {
        type: String
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

const course = mongoose.model('Course', CourseSchema);

module.exports = course;