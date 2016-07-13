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

/**
 * Создаётся простой сервер с API
 */
app.get('/voiddiff/:detail/:line_a/:line_b',(req,res)=>{
    const detail = parseInt(req.params.detail);
    const text1 = req.params.line_a;
    const text2 = req.params.line_b;
    diffString(text1,text2,detail,(diff)=>res.json(diff));
});
app.post('/voiddiff/:detail/',upload.array('diff_files[]',2),(req,res)=>{
    const detail = parseInt(req.params.detail);
	const text1 = req.files[0].buffer.toString();
	const text2 = req.files[1].buffer.toString();
	diffString(text1,text2,detail,(diff)=>res.json(diff));
});

app.listen(8019);