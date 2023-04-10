const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require ('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });
const fs = require('fs');


//hashing password
const salt = bcrypt.genSaltSync(10);
const secret = 'Naegamandeunkuki';  


//middlewares
app.use(cors({credentials:true, origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

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

app.post('/post', uploadMiddleware.single('file'), async (req,res) =>{
    const {originalname,path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length-1];
    const newPath = path+'.'+ext;
    fs.renameSync(path, newPath);

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err,info) => {
        if(err) throw err;
        const {title,summary,content} = req.body;
        const postDoc = await Post.create({
            title,
            summary,
            content,
            cover:newPath,
            author:info.id, 
        });
        res.json(postDoc);
    });    
});

app.get('/post', async (req,res) => {
    res.json(
        await Post.find()
        .populate('author', ['username'])
        .sort({createdAt: -1})
        .limit(20)
    );
});


//sets the app to listen to 4000 server
app.listen(4000);


//iblog                   username
//NeiCmE4zcQH48Ayf        password 

//connection string to mongodb
//mongodb+srv://iblog:<password>@cluster0.mdggqin.mongodb.net/?retryWrites=true&w=majority  

//modified connection string
// mongodb+srv://iblog:NeiCmE4zcQH48Ayf@cluster0.mdggqin.mongodb.net/?retryWrites=true&w=majority


