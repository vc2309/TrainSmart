var express = require('express');
var app=express();
app.use(express.static(__dirname+'/assets'));
app.set('views', __dirname + '/assets/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.get('/', (req,res) => {

	res.render('index');
});
app.get('/home', (req,res) => {
	console.log(req.query.id);
	res.render('index1.html',{"videoname":req.query.id});
});

app.listen('5000')
