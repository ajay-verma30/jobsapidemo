const mysql = require("serverless-mysql");
// const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql({
  host: "3.111.31.7",
  user: "ajay1verma",
  password: process.env.DB_PASSWORD,
  database: "jobsportal",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Use promise-based pool for async/await support
// const promisePool = pool.promise();

module.exports = pool;
