const express = require("express");
const cors = require("cors");
const columnsRouter = require("./routes/columns");
const cardsRouter = require("./routes/cards");
const boardRouter = require("./routes/board");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/columns", columnsRouter);
app.use("/cards", cardsRouter);
app.use("/board", boardRouter);

module.exports = app;