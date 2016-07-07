'use strict';

const diffStringLib = require('./diffStringLib');
const diffString = diffStringLib();

const express = require('express');
const cors = require('cors');
const multer  = require('multer')
const app = express();
const upload = multer();

app.use(cors());
app.use(express.static('public'));

app.get('/diff/:line_a/:line_b',(req,res)=>{
	const text1 = req.params.line_a;
	const text2 = req.params.line_b;
	res.json(diffString(text1,text2));
});
app.post('/diff',upload.array('diff_files[]',2),(req,res)=>{
	const text1 = req.files[0].buffer.toString();
	const text2 = req.files[1].buffer.toString();
	res.json(diffString(text1,text2));
});

app.listen(8019);