const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const app = express();

//hashing password
const salt = bcrypt.genSaltSync(10);

//uses to express api
app.use(cors());
app.use(express.json());

//connect to mongodb
mongoose.connect('mongodb+srv://iblog:NeiCmE4zcQH48Ayf@cluster0.mdggqin.mongodb.net/?retryWrites=true&w=majority');

//registers user, have error handling if a username and password is already registered
app.post('/register', async (req,res) =>{
    const {username,password} = req.body;
    try{
        const userDoc = await User.create({
            username,
            password:bcrypt.hashSync(password, salt),
        });
        res.json(userDoc);
    } catch(e){
        res.status(400).json(e);
    }
} );

//sets the app to listen to 4000 server
app.listen(4000);


//iblog                   username
//NeiCmE4zcQH48Ayf        password 

//connection string to mongodb
//mongodb+srv://iblog:<password>@cluster0.mdggqin.mongodb.net/?retryWrites=true&w=majority  

//modified connection string
// mongodb+srv://iblog:NeiCmE4zcQH48Ayf@cluster0.mdggqin.mongodb.net/?retryWrites=true&w=majority