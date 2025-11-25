const express = require('express');
const router = express.Router();
const db = require('../models');
const { Student, Intervention } = db;

router.post('/', async (req, res) => {
    const { student_id, task_description } = req.body;

    try {
        const student = await Student.findByPk(student_id);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Create intervention task
        await Intervention.create({
            student_id,
            task: task_description,
            status: 'Pending'
        });

        // Update student status to Remedial (Unlocked but with task)
        student.status = 'Remedial';
        await student.save();

        // Emit socket event to unlock the app
        // req.io is available from the middleware in server.js
        req.io.to(`student_${student_id}`).emit('unlock', {
            task: task_description
        });

        res.json({ status: 'Intervention Assigned', student_status: 'Remedial' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
