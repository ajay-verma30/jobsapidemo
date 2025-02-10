const express  = require('express');
const router =  express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();
const shortUniquId = require('short-unique-id')
const uuid = new shortUniquId({lenght: 10})
const pool = require('../db/conn');
// const dbConn = mysql();
// const pool = dbConn.promise();
const bcrypt = require('bcryptjs');


router.post('/register', async(req,res)=>{
    try{
        const id = uuid.rnd();
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(402).json({message:"Details not provided"});
        }
        const existingUser = "SELECT * FROM users WHERE email = ?";
        const[results] = await pool.query(existingUser, [email]);
        if(results.length > 0){
            return res.status(400).json({message:"User exists in the DB. Try login api instead /login"});
        }
        const hashpass = bcrypt.hashSync(password, 12);
        const addUser = "INSERT INTO users(id, email, password) VALUES (?,?,?)"; 
        const [result] = await pool.query(addUser, [id, email, hashpass]);
        if(result.affectedRows === 1){
            const token =jwt.sign({useremail:email}, process.env.USER_TOKEN_GENERATION, {expiresIn:'1h'});
            return res.status(201).json({message:"User added to DB", token})
        }
    }
    catch(e){
        return res.status(500).json({message:"Internal Server Error", error:e});
    }
})

router.post('/generateToken', async(req,res)=>{
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(402).json({message:"Details not provided"});
        }
        const searchUSer = "SELECT * FROM users WHERE email = ?";
        const [result] = await pool.query(searchUSer,[email]);
        if(result.length <= 0){
            return res.status(400).json({message:"User not found in database"})
        }
        const userDetails = result[0];
     const passMatch = bcrypt.compare(userDetails.password, password)
     if(passMatch){
        const token = jwt.sign({useremail:email}, process.env.USER_TOKEN_GENERATION, {expiresIn:"1h"});
        return res.status(201).json({token})
     }
     return res.status(402).json({message:"Credentials invalid"});
    }
    catch(e){
        return res.status(500).json({message:"Internal server error", error:e})
    }
})

router.get('/allusers', async(req,res)=>{
    console.log('inside get method for all users');
    const searchUsers = "SELECT * FROM users";
    console.log("Below searchusers raw query");
    const [results] = await pool.query(searchUsers);
    console.log("below results")
    res.status(200).send(results);
})

module.exports = router;
