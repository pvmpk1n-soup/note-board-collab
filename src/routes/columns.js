const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/", async (req, res) => {
    const { name } = req.body;

    if (!name || typeof name !== "string" || name.trim() === "") {
        return res.status(400).json({ error: "name is required"});
    }
    
    try {
        const countResult = await pool.query("SELECT COUNT(*) FROM columns");
        const position = Number(countResult.rows[0].count);

        const result = await pool.query(
            "INSERT INTO columns (name, position) VALUES ($1, $2) RETURNING *",
            [name.trim(), position]
        );

        const newColumn = result.rows[0];
        res.status(201).json(newColumn);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error : "server error"});
    }
})

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM columns ORDER BY position");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

module.exports = router;