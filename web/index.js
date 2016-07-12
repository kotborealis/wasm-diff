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

app.get('/diff_1/:line_a/:line_b',(req,res)=>{
	const text1 = req.params.line_a;
	const text2 = req.params.line_b;
	diffString(text1,text2,1,(diff)=>res.json(diff));
});
app.post('/diff_0',upload.array('diff_files[]',2),(req,res)=>{
	const text1 = req.files[0].buffer.toString();
	const text2 = req.files[1].buffer.toString();
	diffString(text1,text2,0,(diff)=>res.json(diff));
});

app.listen(8019);