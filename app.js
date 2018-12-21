var express = require('express');
var app=express();
app.use(express.static(__dirname+'/assets'));
app.get('/', (req,res) => {

	res.render('index');
});

app.listen('3000')