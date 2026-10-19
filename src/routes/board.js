const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
	try {
		const columnsResult = await pool.query(
			"SELECT * FROM columns ORDER BY position",
		);
		const cardsResult = await pool.query(
			"SELECT * FROM cards ORDER BY position",
		);

		const board = columnsResult.rows.map((column) => ({
			...column,
			cards: cardsResult.rows.filter(
				(card) => card.column_id === column.id,
			),
		}));

		res.json(board);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "server error" });
	}
});

module.exports = router;
