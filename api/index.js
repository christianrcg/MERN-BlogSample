const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');


//hashing password
const salt = bcrypt.genSaltSync(10);
const secret = 'Naegamandeunkuki';  


//middlewares
app.use(cors({credentials:true, origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());

//connect to mongodb
mongoose.connect('mongodb+srv://iblog:NeiCmE4zcQH48Ayf@cluster0.mdggqin.mongodb.net/?retryWrites=true&w=majority');

//registers user, have error handling if a username and password is already registered, post function from express api
app.post('/register', async (req,res) =>{
    const {username,password} = req.body;
    try{
        const userDoc = await User.create({
            username,
            password:bcrypt.hashSync(password, salt),
        });
        res.json(userDoc);
    } catch(e){
        console.log(e);
        res.status(400).json(e);
    }
} );

//login user, will create cookies nad tokens. Enables 'Sessions'
app.post('/login', async (req,res) => {
    const {username,password} = req.body;
    const userDoc = await User.findOne({username});
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if(passOk){
        jwt.sign({username,id:userDoc._id}, secret, {}, (err,token) => {
            if (err) throw err;
            res.cookie('token', token).json({
                id:userDoc._id,
                username,
            });
        });
    }else{
        res.status(400).json('wrong credentials');
    }
});


app.get('/profile', (req,res) => {
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, (err,info) => {
        if(err) throw err;
        res.json(info);
    });
});

app.post('/logout', (req,res) => {
    res.cookie('token', '').json('ok');
});

//sets the app to listen to 4000 server
app.listen(4000);


//iblog                   username
//NeiCmE4zcQH48Ayf        password 

//connection string to mongodb
//mongodb+srv://iblog:<password>@cluster0.mdggqin.mongodb.net/?retryWrites=true&w=majority  

//modified connection string
// mongodb+srv://iblog:NeiCmE4zcQH48Ayf@cluster0.mdggqin.mongodb.net/?retryWrites=true&w=majority


/*
s
app.post('/login', async (req,res) => {
    const {username,password} = req.body;
    const userDoc = await User.findOne({username});
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if(passOk){
        jwt.sign({username,id:userDoc._id}, secret, {}, (err,token) => {
            if (err) throw err;
            res.json(token);
        });
    }else{
        res.status(400).json('wrong credentials');
    }
});

app.post('/login', async (req,res) => {
    const {username,password} = req.body;
    const userDoc = await User.findOne({username});
    const passOk = bcrypt.compareSync(password, userDoc.password);
    res.json(passOk);
});


token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InF3ZXIiLCJpZCI6IjY0MzNhYmE4ZDg2NTNjOWU4Njk5MjFkOCIsImlhdCI6MTY4MTExMjExMH0.CKjSXI8XcE_UVp4tQIwALixmFw1iaBDT2-3dMQf8SIQ; Path=/
*/