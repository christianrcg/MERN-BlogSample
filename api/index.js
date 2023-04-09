const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://iblog:NeiCmE4zcQH48Ayf@cluster0.mdggqin.mongodb.net/?retryWrites=true&w=majority');

app.post('/register', async (req,res) =>{
    const {username,password} = req.body;
    try{
        const userDoc = await User.create({username,password,});
        res.json(userDoc);
    } catch(e){
        res.status(400).json(e);
    }
} );

app.listen(4000);


//iblog                   username
//NeiCmE4zcQH48Ayf        password 

//connection string to mongodb
//mongodb+srv://iblog:<password>@cluster0.mdggqin.mongodb.net/?retryWrites=true&w=majority  

//modified connection string
// mongodb+srv://iblog:NeiCmE4zcQH48Ayf@cluster0.mdggqin.mongodb.net/?retryWrites=true&w=majority