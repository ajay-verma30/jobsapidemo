const mysql = require('mysql2')
require('dotenv').config();


const myconnection = () =>{
   const connection =  mysql.createPool({
        host: '3.111.31.7',
        user: 'ajay1verma',
        password: process.env.DB_PASSWORD,
        database: 'jobsportal',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
    })
}
module.exports = myconnection;

