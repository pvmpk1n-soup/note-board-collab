const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/", async (req, res) => {
	const { name } = req.body;

	if (!name || typeof name !== "string" || name.trim() === "") {
		return res.status(400).json({ error: "name is required" });
	}

	try {
		const posResult = await pool.query(
			"SELECT COALESCE(MAX(position), -1) + 1 AS next FROM columns",
		);
		const position = posResult.rows[0].next;

		const result = await pool.query(
			"INSERT INTO columns (name, position) VALUES ($1, $2) RETURNING *",
			[name.trim(), position],
		);

		const newColumn = result.rows[0];
		res.status(201).json(newColumn);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "server error" });
	}
});

router.get("/", async (req, res) => {
	try {
		const result = await pool.query(
			"SELECT * FROM columns ORDER BY position",
		);
		res.json(result.rows);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "server error" });
	}
});

router.put("/:id", async (req, res) => {
	const id = Number(req.params.id);
	if (!Number.isInteger(id)) {
		return res.status(400).json({ error: "id must be integer" });
	}
	const { name } = req.body;

	if (!name || typeof name !== "string" || name.trim() === "") {
		return res.status(400).json({ error: "name is required" });
	}

	try {
		const result = await pool.query(
			"UPDATE columns SET name = $1 WHERE id = $2 RETURNING *",
			[name.trim(), id],
		);
		if (result.rows.length === 0) {
			return res.status(404).json({ error: "column not found" });
		}

		res.json(result.rows[0]);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "server error" });
	}
});

router.delete("/:id", async (req, res) => {
	const id = Number(req.params.id);
	if (!Number.isInteger(id)) {
		return res.status(400).json({ error: "id must be integer" });
	}

	try {
		const result = await pool.query("DELETE FROM columns WHERE id = $1", 
            [id,]
        );

		if (result.rowCount === 0) {
			return res.status(404).json({ error: "column not found" });
		}

		res.status(204).send();
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "server error" });
	}
});

module.exports = router;
