const express = require('express');
const app = express();

app.post('/registert', (req,res) =>{
    res.json('test ok - 3');
} );

app.listen(4000);