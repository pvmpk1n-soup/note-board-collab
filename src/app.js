const express = require("express");
const columnsRouter = require("./routes/columns");
const cardsRouter = require("./routes/cards");

const app = express();
app.use(express.json());

app.use("/columns", columnsRouter);
app.use("/cards", cardsRouter);

module.exports = app;