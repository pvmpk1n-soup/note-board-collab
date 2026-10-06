const express = require("express");
const notesRouter = require("./routes/notes");

const app = express();
app.use(express.json());

app.use("/notes", notesRouter);

module.exports = app;