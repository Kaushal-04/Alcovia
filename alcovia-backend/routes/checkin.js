const express = require('express');
const router = express.Router();
const db = require('../models');
const { Student, DailyLog } = db;

router.post('/', async (req, res) => {
    const { student_id, quiz_score, focus_minutes } = req.body;

    try {
        // Find or create student
        let [student] = await Student.findOrCreate({
            where: { id: student_id },
            defaults: { name: 'Student ' + student_id }
        });

        const isSuccess = quiz_score > 7 && focus_minutes > 60;
        const status = isSuccess ? 'On Track' : 'Needs Intervention';

        // Log the daily check-in
        await DailyLog.create({
            student_id,
            quiz_score,
            focus_minutes,
            status: isSuccess ? 'Success' : 'Failure'
        });

        // Update student status
        student.status = status;
        await student.save();

        if (!isSuccess) {
            // Trigger n8n webhook
            const webhookUrl = process.env.N8N_WEBHOOK_URL;
            if (webhookUrl) {
                try {
                    // Using dynamic import or assuming fetch is available (Node 18+)
                    // If fetch is not available, we might need axios. 
                    // For now assuming fetch is global or we use http/https module.
                    // Let's use fetch as it is standard now.
                    await fetch(webhookUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            student_id,
                            quiz_score,
                            focus_minutes,
                            timestamp: new Date().toISOString()
                        })
                    });
                } catch (error) {
                    console.error("Failed to trigger n8n webhook:", error);
                }
            }

            return res.json({ status: "Pending Mentor Review" });
        }

        return res.json({ status: "On Track" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
