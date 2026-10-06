const express = require("express");
const pool = require("../db");
const router = express.Router();

router.post("/", async (req, res) => {
    const { title, content } = req.body;

    if (!title || typeof title !== "string" || title.trim() === "") {
        return res.status(400).json({ error: "title is required"});
    }

    try {
      const result = await pool.query(
        "INSERT INTO notes (title, content) VALUES ($1, $2) RETURNING *",
        [title.trim(), content ?? ""]
      );

      const newNote = result.rows[0];
      const io = req.app.get("io");
      if (io) {
        io.emit("note:created", newNote);
      }

      res.status(201).json(newNote);
    } catch (error) {
      console.error(err);
      res.status(500).json({ error: "server error" });
    }
})

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM notes ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

module.exports = router;

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    const result = await pool.query("SELECT * FROM notes WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "note not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { title, content } = req.body;

  if (!title || typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({ error: "title is required" });
  }

  try {
    const result = await pool.query(
      "UPDATE notes SET title = $1, content = $2 WHERE id = $3 RETURNING *",
      [title.trim(), content ?? "", id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "note not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    const result = await pool.query("DELETE FROM notes WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "note not found" });
    }
    const io = req.app.get("io");
    if (io) {
      io.emit("note:deleted", { id });
    }

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});