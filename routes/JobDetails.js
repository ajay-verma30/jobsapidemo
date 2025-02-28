const express= require('express');
const router = express.Router();
const pool = require('../db/conn');
// const dbConn = mysql();
// const pool = dbConn.promise();
const shortId = require('short-unique-id');
const uuid = new shortId({length:10});
require('dotenv').config();
const authenticateToken = require('../authToken/authToken');


router.post('/update/add/new/job',authenticateToken, async(req,res)=>{
    try{
        const jobId = uuid.rnd();
        const {org_name, job_title, job_description,job_requirements, compensation, last_entry, vacant_positions} = req.body;
        const addJobQuery = "INSERT INTO jobs(id, org_name, job_title, job_description,job_requirements, compensation, last_entry, vacant_positions) VALUES (?,?,?,?,?,?,?,?)";
        const [results] = await pool.query(addJobQuery, [jobId, org_name, job_title, job_description,job_requirements, compensation, last_entry, vacant_positions]);
        if(results.affectedRows === 1){
            return res.status(201).json({message:"Job added to the portal"});
        } 
        else{
            return res.status(401).json({message:"Unable to add job to the portal right now"})
        }
    }
    catch(e){
        res.status(500).json({message:"Internal Server error.", error:e});
    }
    return res.status(200).send("Trying to fetch job details");
})


router.get('/alljobs', authenticateToken, async(req,res)=>{
    try{
        let page = parseInt(req.query.page) || 1;
        let offset = (page - 1) * 5;
        let {minSalary, company} = req.query;
  
  
        const getAll = "SELECT * FROM jobs WHERE 1 = 1"; // this will be the base query and rest will be the parameters added to it
        const totalCount = "SELECT COUNT(*) AS total FROM jobs WHERE 1=1";
        let queryParams = [];
        if(minSalary){
          query += "AND compensation > ?";
          totalCount += "AND compensation > ?";
          queryParams.push(parseInt(minSalary));
        }
  
        if(company){
          query += "AND org_name = ?";
          totalCount += "AND org_name = ?";
          queryParams.push(parseInt(company));
        }
  
        query += " LIMIT 5 OFFSET ?";
        queryParams.push(offset);
  
  const [countResult] = await pool.query(countQuery, queryParams.slice(0, -1)); // Exclude OFFSET param
          let total = countResult[0].total;
          let totalPages = Math.ceil(total / 5);
          const [results] = await pool.query(query, queryParams);
    if(results.length === 0){
        return res.status(400).json({message:"No data found"});
    }
    return res.status(200).json({
        total,
        totalPages,
        page,
        data:results
    });
     }
    catch(e){
    return res.status(500).json({message:"Internal Server Error."});
    }
  })

module.exports = router;