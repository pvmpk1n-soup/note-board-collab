const { Pool } = require("pg");

const pool = new Pool({
  user: "cc",              // your Mac username, based on your terminal prompt
  host: "localhost",
  database: "noteboard",
  password: "",            // empty if you haven't set one
  port: 5432,
});

module.exports = pool;