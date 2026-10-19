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
		const posResult = await pool.query(
		"SELECT COALESCE(MAX(position), -1) + 1 AS next FROM cards WHERE column_id = $1",
		[column_id]
		);
		const position = posResult.rows[0].next;

		const result = await pool.query(
			"INSERT INTO cards (column_id, title, content, position) VALUES ($1, $2, $3, $4) RETURNING *",
			[column_id, title, content ?? "", position],
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

router.get("/:id", async (req, res) => {
	const id = Number(req.params.id);
	if (!Number.isInteger(id)) {
		return res.status(400).json({ error: "id must be integer"});
	}

	try {
		const result = await pool.query("SELECT * FROM cards WHERE id = $1", [id]);
		if (result.rows.length === 0) {
			return res.status(404).json({ error: "card not found"});
		}

		res.json(result.rows[0]);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "server error"});
	}
});

router.put("/:id", async (req, res) => {
	const id = Number(req.params.id);
	if (!Number.isInteger(id)) {
		return res.status(400).json({ error: "id must be integer"});
	}
	const {title, content} = req.body;

	if (!title || typeof title !== "string" || title.trim() === "") {
		return res.status(400).json({ error: "title is required"});
	}

	try {
		const result = await pool.query(
			"UPDATE cards SET title = $1, content = $2 WHERE id = $3 RETURNING *",
			[title.trim(), content ?? "", id]
		);
		if (result.rows.length === 0) {
			return res.status(404).json({ error: "card not found"});
		}

		res.json(result.rows[0]);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "server error"});
	}
});

router.delete("/:id", async (req, res) => {
	const id = Number(req.params.id);
	if (!Number.isInteger(id)) {
		return res.status(400).json({ error: "id must be integer"});
	}

	try {
		const result = await pool.query("DELETE FROM cards WHERE id = $1", [id]);

		if (result.rowCount === 0) {
			return res.status(404).json({ error: "card not found"});
		}

		res.status(204).send();
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "server error"});
	}
});

module.exports = router;
