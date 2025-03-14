const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/', async (req, res) => {
    try {
        const { class_id, year, quarter } = req.body;

        const newEntry = await pool.query(
            "INSERT INTO schedule (class_id, year, quarter) VALUES ($1, $2, $3) RETURNING *",
            [class_id, year, quarter]
        );

        res.json(newEntry.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

router.get('/', async (req, res) => {
    try {
        const schedule = await pool.query(
            "SELECT * FROM schedule ORDER BY year, quarter"
        );

        res.json(schedule.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

router.put('/', async (req, res) => {
    try {
        const { class_id, newYear, newQuarter } = req.body;

        const updatedEntry = await pool.query(
            "UPDATE schedule SET year = $1, quarter = $2 WHERE class_id = $3 RETURNING *",
            [newYear, newQuarter, class_id]
        );

        if (updatedEntry.rows.length === 0) {
            return res.status(404).json({ error: "Class not found" });
        }

        res.json(updatedEntry.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});


router.delete('/:class_id', async (req, res) => {
    try {
        const { class_id } = req.params;

        await pool.query(
            "DELETE FROM schedule WHERE class_id = $1 RETURNING *",
            [class_id]
        );

        res.json({ message: "Class removed from schedule" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});


module.exports = router;