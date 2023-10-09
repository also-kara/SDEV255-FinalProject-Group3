const express = require('express');
const controller = require('../controllers/courseControllers')
const { requireAuth, instructorOnly } = require('../middleware/authMiddleware');

const router = express.Router();


router.get('/', controller.course_index);
router.get('/add', instructorOnly, controller.course_add_get);
router.post('/add', instructorOnly, controller.course_add_post);
router.get('/update/:id', instructorOnly, controller.course_update_get);
router.post('/update/:id', instructorOnly, controller.course_update_post);
router.delete('/:id', instructorOnly, controller.course_delete);
router.get('/:id', controller.course_get);


module.exports = router;