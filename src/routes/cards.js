const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/", async (req, res) => {
	const { column_id, title, content } = req.body;

	if (!title || typeof title !== "string" || title.trim() === "") {
		return res.status(400).json({ error: "title is required" });
	}

	if (!column_id || typeof column_id !== "number") {
		return res.status(400).json({ error: "column_id is required" });
	}

	try {
		const countResult = await pool.query(
			"SELECT COUNT(*) FROM cards WHERE column_id = $1",
			[column_id],
		);
		const position = Number(countResult.rows[0].count);

		const result = await pool.query(
			"INSERT INTO cards (column_id, title, content, position) VALUES ($1, $2, $3, $4) RETURNING *",
			[column_id, title, content, position],
		);

		const newCard = result.rows[0];
		res.status(201).json(newCard);
	} catch (error) {
		if (error.code === "23503") {
			return res.status(400).json({ error: "column_id does not exist" });
		}
		console.error(error);
		res.status(500).json({ error: "server error" });
	}
});

router.get("/", async (req, res) => {
	try {
		const result = await pool.query(
			"SELECT * FROM cards ORDER BY column_id, position",
		);
		res.json(result.rows);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "server error" });
	}
});

module.exports = router;
