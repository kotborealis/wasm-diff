'use strict';

const diffStringLib = require('./diffStringLib');
const diffString = diffStringLib();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

app.get('/diff/:line_a/:line_b',(req,res)=>{
	const text1 = req.params.line_a;
	const text2 = req.params.line_b;
	res.json(diffString(text1,text2));
});
app.post('/diff',(req,res)=>{
	const text1 = req.body.text1;
	const text2 = req.body.text2;
	res.json(diffString(text1,text2));
});

app.listen(8019);