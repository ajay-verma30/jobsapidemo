const express  = require('express');
const router =  express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();
const shortUniquId = require('short-unique-id')
const uuid = new shortUniquId({lenght: 10})
const pool = require('../db/conn')
// const mysql = require('../db/conn');
// const dbConn = mysql();
// const promiseConn = dbConn.promise();
const bcrypt = require('bcryptjs');

router.post('/register', async (req, res) => {
    try {
        const connection = await pool.getConnection(); // Get connection
        const id = uuid.rnd();
        const { email, password } = req.body;

        const existingUser = "SELECT * FROM users WHERE email = ?";
        const [results] = await connection.query(existingUser, [email]);

        if (results.length > 0) {
            connection.release(); // Release connection
            return res.status(400).json({ message: "User exists in the DB. Try login api instead /login" });
        }

        const hashpass = bcrypt.hashSync(password, 12);
        const addUser = "INSERT INTO users(id, email, password) VALUES (?,?,?)";
        const [result] = await connection.query(addUser, [id, email, hashpass]);

        connection.release(); // Release connection

        if (result.affectedRows === 1) {
            const token = jwt.sign({ useremail: email }, process.env.USER_TOKEN_GENERATION, { expiresIn: '1h' });
            return res.status(201).json({ message: "User added to DB", token });
        }
    } catch (e) {
        console.error("Register Error:", e);
        return res.status(500).json({ message: "Internal Server Error", error: e.message });
    }
});


router.post('/generateToken', async(req,res)=>{
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(402).json({message:"Details not provided"});
            connection.release(); // Release connection
        }
        const searchUSer = "SELECT * FROM users WHERE email = ?";
        const [result] = await pool.query(searchUSer,[email]);
        if(result.length <= 0){
            return res.status(400).json({message:"User not found in database"})
            connection.release(); // Release connection
        }
        const userDetails = result[0];
     const passMatch = bcrypt.compare(userDetails.password, password);
     if(passMatch){
        const token = jwt.sign({useremail:email}, process.env.USER_TOKEN_GENERATION, {expiresIn:"1h"});
        return res.status(201).json({token})
        connection.release(); // Release connection
     }
     return res.status(402).json({message:"Credentials invalid"});
    }
    catch(e){
        return res.status(500).json({message:"Internal server error", error:e})
    }
})

module.exports = router;
