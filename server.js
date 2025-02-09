const express = require('express')
const app = express()
require('dotenv').config();
const cors = require('cors');
const morgan = require('morgan');
require('./db/conn')

app.use(cors());
app.use(express.json());
app.use(morgan('combined'));
app.use('/jobdetails', require('./routes/JobDetails'));
app.use('/user', require('./routes/user'));

app.get('/', (req,res)=>{
    res.status(200).send({message:"testing"});
})


const port = process.env.PORT||3001;
app.listen(port, ()=>{
    console.log(`http://localhost:${port}/`);
});